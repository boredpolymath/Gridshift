const test = require('node:test');
const assert = require('node:assert/strict');
const { CALC_VERSION, calc, parseCsv, csvValue, validateBackup, migrateLegacyFactor, migrateLegacyCosts } = require('../core.js');

function project(overrides = {}) {
  const asset = {
    id: 'asset-1', assetId: 'CB-1', site: 'North', category: 'Circuit breaker',
    voltageKv: 145, capacityKg: 50, installYear: 2010, retirementYear: 2040,
    lossMode: 'estimated', lossRate: 0.02, lossSource: 'Metered record',
    remainingGasKg: 10, recoveryEfficiency: 0.9,
    annualOpex: 100, annualMaintenance: 50, capex: 900, installCost: 100,
    decommissionCost: 0, recoveryCost: 0
  };
  const technology = {
    id: 'tech-1', name: 'Vacuum GIS', gasComposition: 'Air', altAnnualCO2e: 5,
    annualOpex: 20, annualMaintenance: 10, residualValue: 0
  };
  return {
    id: 'project-1', name: 'Test project', baseYear: 2026, horizon: 2,
    currency: 'USD', priceYear: 2026, discountRate: 0, gwp: 24300,
    gwpHorizon: '100-year', gwpSource: 'IPCC AR6 WGI SM.7', factorVersion: 'AR6 WGI 2021',
    assets: [asset], technologies: [technology], ...overrides
  };
}

function backup(overrides = {}) {
  const p = {
    id: 'project-1', name: 'Test project', baseYear: 2026, horizon: 2,
    currency: 'USD', priceYear: 2026, discountRate: 0.04, gwp: 24300,
    sites: [{ id: 'site-1', name: 'North' }],
    assets: [{
      id: 'asset-1', assetId: 'CB-1', site: 'North', category: 'Circuit breaker',
      voltageKv: 145, capacityKg: 50, installYear: 2010, retirementYear: 2040,
      lossMode: 'estimated', lossRate: 0.02, lossSource: 'Metered record'
    }],
    technologies: [{
      id: 'tech-1', name: 'Vacuum GIS', insulation: 'Vacuum interruption',
      gasComposition: 'Air', source: 'Manufacturer datasheet', voltageKv: 145,
      altAnnualCO2e: 5, annualOpex: 20, annualMaintenance: 10, residualValue: 0
    }],
    scenarios: [{ id: 'scenario-1', name: 'Plan A', replacements: {} }]
  };
  return {
    format: 'gridshift-backup', version: 1,
    data: { version: 1, projects: [{ ...p, ...overrides }], activeProjectId: 'project-1' }
  };
}
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} is not close to ${expected}`);

test('calculation uses annual losses and selected GWP with explicit units', () => {
  const result = calc(project(), null);
  assert.equal(result.version, CALC_VERSION);
  assert.deepEqual(result.years, [2026, 2027]);
  assert.equal(result.baselineTotal, 48_600);
  assert.equal(result.scenarioTotal, 48_600);
  assert.equal(result.avoided, 0);
  assert.equal(result.incomplete.length, 0);
});

test('replacement emissions include end-of-life unrecovered gas and alternative emissions', () => {
  const p = project();
  const scenario = {
    calcVersion: '1.0', gwpSnapshot: 24300, baseYearSnapshot: 2026,
    horizonSnapshot: 2, discountSnapshot: 0, budget: 950,
    replacements: { 'asset-1': { year: 2026, technologyId: 'tech-1' } }
  };
  const result = calc(p, scenario);
  assert.equal(result.version, '1.0');
  near(result.annual[0].scenario, 24_305);
  near(result.annual[1].scenario, 5);
  near(result.scenarioTotal, 24_310);
  near(result.avoided, 24_290);
  assert.equal(result.costsByYear[0].cost, 1_000);
  assert.equal(result.costsByYear[0].over, true);
  assert.equal(result.npc, 1_060);
  assert.equal(result.baselineNpc, 300);
  assert.equal(result.incrementalNpc, 760);
});

test('residual value is credited when replacement occurs in the final planning year', () => {
  const p = project();
  p.technologies[0].residualValue = 50;
  const result = calc(p, {
    calcVersion: '1.2', gwpSnapshot: 24300, baseYearSnapshot: 2026,
    horizonSnapshot: 2, discountSnapshot: 0,
    replacements: { 'asset-1': { year: 2027, technologyId: 'tech-1' } }
  });
  assert.equal(result.annual[1].cost, 980);
  assert.equal(result.npc, 1130);
});

test('unknown residual value makes replacement lifecycle cost incomplete', () => {
  const p = project();
  delete p.technologies[0].residualValue;
  const result = calc(p, {
    calcVersion: '1.2', gwpSnapshot: 24300, baseYearSnapshot: 2026,
    horizonSnapshot: 2, discountSnapshot: 0,
    replacements: { 'asset-1': { year: 2026, technologyId: 'tech-1' } }
  });
  assert.ok(result.incomplete.some(item => item.includes('residual value missing')));
  assert.equal(result.costPerTonne, null);
});

test('saved scenario snapshots remain stable after project GWP changes', () => {
  const p = project();
  const scenario = {
    calcVersion: '1.0', gwpSnapshot: 25200, baseYearSnapshot: 2026,
    horizonSnapshot: 2, discountSnapshot: 0,
    inputSnapshot: {
      assets: p.assets, technologies: p.technologies,
      factor: { gwp: 25200, horizon: '100-year', source: 'Legacy', version: 'Legacy' }
    }, replacements: {}
  };
  assert.equal(calc(p, scenario).baselineTotal, 50_400);
  assert.equal(calc(p, scenario).version, '1.0');
});

test('legacy default migration updates projects while preserving and flagging old scenario values', () => {
  const state = { projects: [{
    gwp: 25200, gwpSource: 'Legacy Gridshift source', gwpHorizon: '100-year', factorVersion: 'AR6',
    scenarios: [{ gwpSnapshot: 25200 }, { gwpSnapshot: 30000 }]
  }, { gwp: 18000, gwpSource: 'User source', scenarios: [] }] };
  const count = migrateLegacyFactor(state, 'Legacy Gridshift source', {
    value: 24300, horizon: '100-year', source: 'IPCC AR6 WGI SM.7', version: 'AR6 WGI 2021'
  });
  assert.equal(count, 1);
  assert.equal(state.projects[0].gwp, 24300);
  assert.equal(state.projects[0].scenarios[0].gwpSnapshot, 25200);
  assert.equal(state.projects[0].scenarios[0].factorReviewRequired, true);
  assert.equal(state.projects[0].scenarios[1].factorReviewRequired, undefined);
  assert.equal(state.projects[1].gwp, 18000);
});

test('legacy blank cost fields stored as zero migrate to unknown and remain reviewable', () => {
  const state = { projects: [{
    assets: [{ annualOpex: 0, annualMaintenance: 75, capex: 0 }],
    technologies: [{ annualOpex: 0, annualMaintenance: 0, residualValue: 0 }],
    scenarios: [{ inputSnapshot: {
      assets: [{ annualOpex: 0, annualMaintenance: 75, capex: 0 }],
      technologies: [{ annualOpex: 0, annualMaintenance: 0, residualValue: 0 }]
    } }]
  }] };
  assert.equal(migrateLegacyCosts(state), 1);
  assert.equal(state.projects[0].assets[0].annualOpex, null);
  assert.equal(state.projects[0].assets[0].annualMaintenance, 75);
  assert.equal(state.projects[0].technologies[0].annualOpex, null);
  assert.equal(state.projects[0].technologies[0].residualValue, null);
  assert.equal(state.projects[0].scenarios[0].inputSnapshot.assets[0].annualOpex, 0);
  assert.equal(state.projects[0].scenarios[0].legacyCostReviewRequired, true);
});

test('incomplete loss inputs are flagged and do not produce a complete cost-per-tonne result', () => {
  const p = project({ assets: [{ ...project().assets[0], lossRate: undefined }] });
  const result = calc(p, null);
  assert.equal(result.baselineTotal, 0);
  assert.equal(result.costPerTonne, null);
  assert.match(result.incomplete[0], /missing\/invalid annual SF₆ loss input/);
});

test('blank cost inputs are kept as partial totals, not reported as complete zeros', () => {
  const p = project();
  p.assets[0].annualOpex = null;
  const result = calc(p, null);
  assert.ok(result.incomplete.some(item => /annual operating cost missing/.test(item)));
  assert.equal(result.costPerTonne, null);
});

test('CSV parser supports BOM, CRLF, escaped quotes, and quoted newlines', () => {
  const rows = parseCsv('\uFEFFname,notes\r\nGrid,"Line one\r\nLine ""two"""\r\n');
  assert.deepEqual(rows, [{ name: 'Grid', notes: 'Line one\r\nLine "two"' }]);
});

test('CSV parser rejects duplicate headers, malformed quotes, and oversized records', () => {
  assert.throws(() => parseCsv('a,a\n1,2'), /duplicate column names/);
  assert.throws(() => parseCsv('a,b\n1,"unfinished'), /unclosed quoted field/);
  assert.throws(() => parseCsv('a,b\n1,"2"x'), /unexpected text after a closing quote/);
});

test('CSV export neutralizes spreadsheet formulas and round-trips its escape marker', () => {
  const escaped = csvValue(' =HYPERLINK("https://example.invalid")');
  assert.ok(escaped.startsWith('"\''));
  assert.deepEqual(parseCsv(`value\n${escaped}`), [{ value: ' =HYPERLINK("https://example.invalid")' }]);
  assert.equal(csvValue(-4), '-4');
});

test('backup validation accepts a complete project and rejects duplicate or invalid nested records', () => {
  assert.equal(validateBackup(backup()).projects.length, 1);
  const duplicate = backup({ assets: [
    { id: 'asset-1', assetId: 'CB-1', site: 'North', category: 'Circuit breaker', voltageKv: 145, capacityKg: 50, installYear: 2010, retirementYear: 2040 },
    { id: 'asset-2', assetId: 'cb-1', site: 'North', category: 'Circuit breaker', voltageKv: 145, capacityKg: 50, installYear: 2010, retirementYear: 2040 }
  ] });
  assert.throws(() => validateBackup(duplicate), /duplicate asset identifier/);
  assert.throws(() => validateBackup(backup({ currency: 'USDX' })), /invalid identity or planning assumptions/);
  assert.throws(() => validateBackup(backup({ horizon: 2.5 })), /invalid identity or planning assumptions/);
  const unsafeId = backup({ id: 'project"><img src=x>' });
  assert.throws(() => validateBackup(unsafeId), /invalid identity or planning assumptions/);
  const invalidAssignment = backup({ scenarios: [{
    id: 'scenario-1', name: 'Plan A', replacements: { 'unknown-asset': { year: 2026, technologyId: 'tech-1' } }
  }] });
  assert.throws(() => validateBackup(invalidAssignment), /invalid replacement assignment/);
  const invalidLossMode = backup({ assets: [{
    id: 'asset-1', assetId: 'CB-1', site: 'North', category: 'Circuit breaker',
    voltageKv: 145, capacityKg: 50, installYear: 2010, retirementYear: 2040,
    lossMode: 'estimated-ish', lossRate: 0.02
  }] });
  assert.throws(() => validateBackup(invalidLossMode), /invalid loss mode/);
});

test('backup validation bounds scenario snapshot assumptions even without replacement assignments', () => {
  const validSnapshot = backup({ scenarios: [{
    id: 'scenario-1', name: 'Plan A', baseYearSnapshot: 2026,
    horizonSnapshot: 2, discountSnapshot: 0.04, gwpSnapshot: 24300,
    inputSnapshot: {
      assets: backup().data.projects[0].assets,
      technologies: backup().data.projects[0].technologies,
      factor: { gwp: 24300, horizon: '100-year', source: 'Test', version: '1' },
      currency: 'USD', priceYear: 2026
    },
    replacements: {}
  }] });
  assert.equal(validateBackup(validSnapshot).projects.length, 1);

  for (const value of [1_000_000_000, 51, 0, 2.5]) {
    const invalid = backup({ scenarios: [{
      id: 'scenario-1', name: 'Plan A', horizonSnapshot: value, replacements: {}
    }] });
    assert.throws(() => validateBackup(invalid), /invalid planning snapshot/);
  }
  for (const [field, value] of [['baseYearSnapshot', '<img src=x>'], ['baseYearSnapshot', 2026.5], ['discountSnapshot', 1.1], ['gwpSnapshot', 1_000_001]]) {
    const invalid = backup({ scenarios: [{ id: 'scenario-1', name: 'Plan A', [field]: value, replacements: {} }] });
    assert.throws(() => validateBackup(invalid), /invalid planning snapshot/);
  }
  for (const [field, value] of [['currency', 'USDX'], ['priceYear', 2201]]) {
    const invalid = backup({ scenarios: [{
      id: 'scenario-1', name: 'Plan A', replacements: {},
      inputSnapshot: { assets: [], technologies: [], factor: { gwp: 24300, horizon: '100-year', source: 'Test', version: '1' }, [field]: value }
    }] });
    assert.throws(() => validateBackup(invalid), /invalid calculation snapshot/);
  }
});

test('calculator rejects an out-of-range horizon before allocating annual rows', () => {
  assert.throws(() => calc(project(), { horizonSnapshot: 1_000_000_000 }), /horizon must be between 1 and 50/);
  assert.throws(() => calc(project(), { baseYearSnapshot: '<img src=x>' }), /base year must be between 2000 and 2200/);
});
