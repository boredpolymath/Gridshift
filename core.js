(() => {
  const CALC_VERSION = '1.2';
  const APP_VERSION = '0.2.3';
  const MAX_STATE_CHARS = 1_500_000;

  function calc(p,s){
    const baseYear=Number(s?.baseYearSnapshot??p.baseYear),horizon=Number(s?.horizonSnapshot??p.horizon),gwp=Number(s?.gwpSnapshot??p.gwp);
    if(!Number.isInteger(baseYear)||baseYear<2000||baseYear>2200)throw Error('Calculation base year must be between 2000 and 2200.');
    if(!Number.isInteger(horizon)||horizon<1||horizon>50)throw Error('Calculation horizon must be between 1 and 50 years.');
    const start=baseYear,end=start+horizon-1,years=Array.from({length:horizon},(_,i)=>start+i),replacement=s?.replacements||{},assets=s?.inputSnapshot?.assets??p.assets,technologies=s?.inputSnapshot?.technologies??p.technologies,annual=years.map(year=>({year,baseline:0,scenario:0,cost:0,capital:0,baselineCost:0,assets:[]}));let incomplete=[];let npc=0,baselineNpc=0;const discount=Number(s?.discountSnapshot??p.discountRate)||0;
    for(const a of assets){const plan=replacement[a.id],repYear=plan?.year,cap=Number(a.capacityKg),rate=Number(a.lossRate),measured=Number(a.measuredLoss),rawLoss=a.lossMode==='measured'?measured:cap*rate,loss=Number.isFinite(rawLoss)&&rawLoss>=0?rawLoss:0;
      if(!Number.isFinite(rawLoss)||rawLoss<0)incomplete.push(`${a.assetId}: missing/invalid annual SF₆ loss input; emissions total is partial`);
      for(const key of ['annualOpex','annualMaintenance'])if(a[key]===undefined||a[key]===null||a[key]==='')incomplete.push(`${a.assetId}: ${key==='annualOpex'?'annual operating':'annual maintenance'} cost missing; lifecycle cost total is partial`);
      const tech=technologies.find(t=>t.id===plan?.technologyId);if(plan&&plan.year<end+1&&!tech)incomplete.push(`${a.assetId}: replacement technology not selected`);
      if(plan&&plan.year<=end)for(const key of ['capex','installCost','decommissionCost','recoveryCost'])if(a[key]===undefined||a[key]===null||a[key]==='')incomplete.push(`${a.assetId}: ${key} missing; replacement cost total is partial`);
      if(plan&&plan.year<=end&&tech&&(tech.residualValue===undefined||tech.residualValue===null||tech.residualValue===''))incomplete.push(`${a.assetId}: replacement technology residual value missing; lifecycle cost total is partial`);
      for(const row of annual){row.baseline+=loss*(Number(gwp)||0);row.baselineCost+=(Number(a.annualOpex)||0)+(Number(a.annualMaintenance)||0);if(!plan||plan.year>row.year){row.scenario+=loss*(Number(gwp)||0);row.cost+=(Number(a.annualOpex)||0)+(Number(a.annualMaintenance)||0)}else if(plan.year===row.year){const remain=Number(a.remainingGasKg),recovery=Number(a.recoveryEfficiency);if(a.remainingGasKg!==null&&a.remainingGasKg!==''&&a.recoveryEfficiency!==null&&a.recoveryEfficiency!==''&&Number.isFinite(remain)&&Number.isFinite(recovery))row.scenario+=remain*(1-recovery)*(Number(gwp)||0);else incomplete.push(`${a.assetId}: end-of-life gas/recovery input unavailable`);if(tech){if(tech.altAnnualCO2e!==null&&tech.altAnnualCO2e!==''&&Number.isFinite(Number(tech.altAnnualCO2e)))row.scenario+=Number(tech.altAnnualCO2e);else if(tech.gasComposition)incomplete.push(`${a.assetId}: alternative gas emissions not quantified`);for(const key of ['annualOpex','annualMaintenance'])if(tech[key]===undefined||tech[key]===null||tech[key]==='')incomplete.push(`${a.assetId}: replacement technology ${key} missing; lifecycle cost total is partial`);row.cost+=(Number(tech.annualOpex)||0)+(Number(tech.annualMaintenance)||0)}const capital=(Number(a.capex)||0)+(Number(a.installCost)||0)+(Number(a.decommissionCost)||0)+(Number(a.recoveryCost)||0);row.capital+=capital;row.cost+=capital}
        else if(tech){if(tech.altAnnualCO2e!==null&&tech.altAnnualCO2e!==''&&Number.isFinite(Number(tech.altAnnualCO2e)))row.scenario+=Number(tech.altAnnualCO2e);else if(tech.gasComposition)incomplete.push(`${a.assetId}: alternative gas emissions not quantified`);for(const key of ['annualOpex','annualMaintenance'])if(tech[key]===undefined||tech[key]===null||tech[key]==='')incomplete.push(`${a.assetId}: replacement technology ${key} missing; lifecycle cost total is partial`);row.cost+=(Number(tech.annualOpex)||0)+(Number(tech.annualMaintenance)||0)}
        if(plan&&plan.year<=end&&row.year===end&&tech)row.cost-=Number(tech.residualValue)||0;
      }
    }
    for(const r of annual){const t=Math.max(0,r.year-start);npc+=r.cost/Math.pow(1+discount,t);baselineNpc+=r.baselineCost/Math.pow(1+discount,t)}
    const baselineAnnual=annual.length?annual.reduce((n,r)=>n+r.baseline,0)/annual.length:0,scenarioTotal=annual.reduce((n,r)=>n+r.scenario,0),baselineTotal=annual.reduce((n,r)=>n+r.baseline,0),avoided=baselineTotal-scenarioTotal,incrementalNpc=npc-baselineNpc;
    const costsByYear=annual.map(r=>({year:r.year,cost:r.capital,totalCost:r.cost,budget:Number(s?.budget)||0,over:Number(s?.budget)>0&&r.capital>Number(s.budget)}));
    return {years,annual,baselineAnnual,baselineTotal,scenarioTotal,avoided,npc,baselineNpc,incrementalNpc,costPerTonne:avoided>0&&incomplete.length===0?incrementalNpc/(avoided/1000):null,incomplete:[...new Set(incomplete)],costsByYear,currency:s?.inputSnapshot?.currency??p.currency,priceYear:s?.inputSnapshot?.priceYear??p.priceYear,factor:s?.inputSnapshot?.factor??{gwp,horizon:p.gwpHorizon,source:p.gwpSource,version:p.factorVersion},factorReviewRequired:s?.factorReviewRequired===true,legacyCostReviewRequired:s?.legacyCostReviewRequired===true,version:s?.calcVersion??CALC_VERSION};
  }

  function parseCsv(text){
    if(typeof text!=='string')throw Error('CSV contents must be text.');
    if(text.length>5*1024*1024)throw Error('CSV exceeds 5 MB. Split the file and retry.');
    const rows=[];let row=[],cell='',quoted=false,closedQuote=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'&&text[i+1]==='"'){cell+='"';i++}else if(c==='"'){quoted=false;closedQuote=true}else cell+=c;continue}
      if(c==='"'){if(cell!=='')throw Error('CSV contains a quote inside an unquoted field.');quoted=true;continue}
      if(c===','){row.push(cell.replace(/\r$/,''));cell='';closedQuote=false;continue}
      if(c==='\n'){row.push(cell.replace(/\r$/,''));if(row.some(v=>v!==''))rows.push(row);row=[];cell='';closedQuote=false;continue}
      if(closedQuote&&!/[\r]/.test(c))throw Error('CSV has unexpected text after a closing quote.');
      cell+=c;
    }
    if(quoted)throw Error('CSV contains an unclosed quoted field.');
    if(cell!==''||row.length){row.push(cell.replace(/\r$/,''));if(row.some(v=>v!==''))rows.push(row)}
    if(!rows.length)throw Error('CSV is empty.');
    const headers=rows.shift().map((h,i)=>(i===0?h.replace(/^\uFEFF/,''):h).trim());
    if(headers.some(h=>!h))throw Error('CSV contains a blank column name.');
    if(new Set(headers).size!==headers.length)throw Error('CSV contains duplicate column names.');
    if(rows.length>10000)throw Error('CSV contains more than 10,000 records. Split the file and retry.');
    return rows.map((r,i)=>{if(r.length!==headers.length)throw Error(`Row ${i+2} has ${r.length} values; expected ${headers.length}.`);if(r.some(v=>v.length>100000))throw Error(`Row ${i+2} contains a field longer than 100,000 characters.`);return Object.fromEntries(headers.map((h,j)=>{const value=r[j]?.trim()??'';return [h,value.replace(/^'(?=[\t\r\n ]*[=+\-@])/,'')]}) )});
  }

  function csvValue(v){let s=String(v??'');if(typeof v==='string'&&/^[\t\r\n ]*[=+\-@]/.test(s))s=`'${s}`;return /[",\n\r]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}

  function migrateLegacyFactor(state,legacySource,factor){let count=0;for(const p of state.projects||[]){if(Number(p.gwp)===25200&&p.gwpSource===legacySource){p.gwp=factor.value;p.gwpHorizon=factor.horizon;p.gwpSource=factor.source;p.factorVersion=factor.version;for(const s of p.scenarios||[])if(Number(s.gwpSnapshot)===25200)s.factorReviewRequired=true;count++}}return count}

  function migrateLegacyCosts(state){let count=0;const keys=['annualOpex','annualMaintenance','capex','installCost','decommissionCost','recoveryCost','residualValue'];for(const p of state.projects||[]){let projectChanged=false;for(const record of [...(p.assets||[]),...(p.technologies||[])])for(const key of keys)if(record[key]===0){record[key]=null;projectChanged=true}for(const s of p.scenarios||[]){const snapshots=[...(s.inputSnapshot?.assets||[]),...(s.inputSnapshot?.technologies||[])];if(snapshots.some(record=>keys.some(key=>record[key]===0)))s.legacyCostReviewRequired=true}if(projectChanged)count++}return count}

  function validateBackup(o){
    const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),text=(x,max=10000)=>typeof x==='string'&&x.trim().length>0&&x.length<=max,finite=(x,min=-Number.MAX_VALUE,max=Number.MAX_VALUE)=>(typeof x==='number'||typeof x==='string')&&x!==''&&Number.isFinite(Number(x))&&Number(x)>=min&&Number(x)<=max,integer=(x,min,max)=>finite(x,min,max)&&Number.isInteger(Number(x));
    const list=(value,label,max)=>{if(!Array.isArray(value)||value.length>max)throw Error(`${label} must be a list with at most ${max} records.`)};
    const uniqueIds=(values,label)=>{const seen=new Set();for(const item of values){if(!isObject(item)||!text(item.id,200)||!/^[A-Za-z0-9_-]+$/.test(item.id))throw Error(`${label} contains a record with a missing or unsafe ID.`);if(seen.has(item.id))throw Error(`${label} contains duplicate ID “${item.id}”.`);seen.add(item.id)}return seen};
    if(!isObject(o)||o.format!=='gridshift-backup'||o.version!==1||!isObject(o.data)||o.data.version!==1||!Array.isArray(o.data.projects)||o.data.projects.length>250)throw Error('Unsupported or malformed backup. Expected a Gridshift version 1 backup with at most 250 projects.');
    if(JSON.stringify(o.data).length>MAX_STATE_CHARS)throw Error('Backup exceeds Gridshift’s 3 MB local-data limit. Split the workspace into smaller backups.');
    const projectIds=new Set();let totalAssets=0;
    for(const p of o.data.projects){
      if(!isObject(p)||!text(p.id,200)||!/^[A-Za-z0-9_-]+$/.test(p.id)||!text(p.name,300)||!text(p.currency,3)||!/^[A-Za-z]{3}$/.test(p.currency)||!integer(p.baseYear,2000,2200)||!integer(p.horizon,1,50)||!integer(p.priceYear,2000,2200)||!finite(p.discountRate,0,1)||!finite(p.gwp,0,1000000))throw Error('Backup contains a project with invalid identity or planning assumptions.');
      if(projectIds.has(p.id))throw Error(`Backup contains duplicate project ID “${p.id}”.`);projectIds.add(p.id);
      for(const [key,max] of [['sites',1000],['assets',10000],['technologies',1000],['scenarios',1000]])list(p[key],`Project “${p.name}” ${key}`,max);
      if(p.activeScenarioId!==null&&p.activeScenarioId!==undefined&&!p.scenarios.some(s=>s?.id===p.activeScenarioId))throw Error(`Project “${p.name}” refers to a missing active scenario.`);
      if(p.weights!==undefined&&(!isObject(p.weights)||!finite(p.weights.age,0,100)||!finite(p.weights.emissions,0,100)||!finite(p.weights.condition,0,100)||Number(p.weights.age)+Number(p.weights.emissions)+Number(p.weights.condition)===0))throw Error(`Project “${p.name}” has invalid prioritization weights.`);
      totalAssets+=p.assets.length;if(totalAssets>20000)throw Error('Backup contains more than 20,000 assets. Split it into smaller backups.');
      const sites=uniqueIds(p.sites,`Project “${p.name}” sites`),assets=uniqueIds(p.assets,`Project “${p.name}” assets`),technologies=uniqueIds(p.technologies,`Project “${p.name}” technology profiles`),scenarios=uniqueIds(p.scenarios,`Project “${p.name}” scenarios`);
      for(const site of p.sites)if(!text(site.name,300))throw Error(`Project “${p.name}” contains a site with an invalid name.`);
      const assetNames=new Set();
      const validateAsset=(a,label)=>{if(!text(a.assetId,200)||!text(a.site,300)||!text(a.category,100)||!finite(a.voltageKv,0,2000)||!finite(a.capacityKg,0,100000000)||!finite(a.installYear,1900,2200)||!finite(a.retirementYear,1900,2300)||Number(a.retirementYear)<Number(a.installYear))throw Error(`${label} contains an asset with invalid required fields.`);if(a.lossMode!==undefined&&!['estimated','measured'].includes(a.lossMode))throw Error(`Asset “${a.assetId}” has an invalid loss mode.`);if(a.lossMode==='measured'&&a.measuredLoss!==undefined&&a.measuredLoss!==null&&a.measuredLoss!==''&&!finite(a.measuredLoss,0,100000000))throw Error(`Asset “${a.assetId}” has an invalid measured loss.`);if(a.lossMode==='estimated'&&a.lossRate!==undefined&&a.lossRate!==null&&a.lossRate!==''&&!finite(a.lossRate,0,1))throw Error(`Asset “${a.assetId}” has an invalid estimated loss rate.`);for(const key of ['remainingGasKg','recoveryEfficiency','annualOpex','annualMaintenance','capex','installCost','decommissionCost','recoveryCost'])if(a[key]!==undefined&&a[key]!==null&&a[key]!==''&&!finite(a[key],0,key==='recoveryEfficiency'?1:1000000000000))throw Error(`Asset “${a.assetId}” has an invalid ${key}.`);if(a.customAttributes!==undefined&&(!isObject(a.customAttributes)||JSON.stringify(a.customAttributes).length>100000))throw Error(`Asset “${a.assetId}” has invalid custom attributes.`)};
      const validateTechnology=(t,label)=>{if(!text(t.name,300)||!text(t.insulation,300)||!text(t.gasComposition,2000)||!text(t.source,5000)||t.voltageKv!==undefined&&t.voltageKv!==null&&t.voltageKv!==''&&!finite(t.voltageKv,0,2000)||t.altAnnualCO2e!==undefined&&t.altAnnualCO2e!==null&&t.altAnnualCO2e!==''&&!finite(t.altAnnualCO2e,0,1000000000000))throw Error(`${label} contains a technology profile with invalid fields.`);for(const key of ['annualOpex','annualMaintenance','residualValue'])if(t[key]!==undefined&&t[key]!==null&&t[key]!==''&&!finite(t[key],0,1000000000000))throw Error(`Technology profile “${t.name}” has an invalid ${key}.`)};
      for(const a of p.assets){validateAsset(a,`Project “${p.name}”`);const key=a.assetId.toLowerCase();if(assetNames.has(key))throw Error(`Project “${p.name}” contains duplicate asset identifier “${a.assetId}”.`);assetNames.add(key)}
      for(const t of p.technologies)validateTechnology(t,`Project “${p.name}”`);
      for(const s of p.scenarios){if(!text(s.name,300)||!isObject(s.replacements||{}))throw Error(`Project “${p.name}” contains a scenario with invalid fields.`);if(s.baseYearSnapshot!==undefined&&!integer(s.baseYearSnapshot,2000,2200)||s.horizonSnapshot!==undefined&&!integer(s.horizonSnapshot,1,50)||s.discountSnapshot!==undefined&&!finite(s.discountSnapshot,0,1)||s.gwpSnapshot!==undefined&&!finite(s.gwpSnapshot,0,1000000))throw Error(`Scenario “${s.name}” contains an invalid planning snapshot.`);let snapshotAssetIds=new Set(),snapshotTechnologyIds=new Set();if(s.inputSnapshot!==undefined){if(!isObject(s.inputSnapshot)||!Array.isArray(s.inputSnapshot.assets)||!Array.isArray(s.inputSnapshot.technologies)||!isObject(s.inputSnapshot.factor)||!finite(s.inputSnapshot.factor.gwp,0,1000000)||!text(s.inputSnapshot.factor.horizon,100)||!text(s.inputSnapshot.factor.source,5000)||!text(s.inputSnapshot.factor.version,200)||s.inputSnapshot.currency!==undefined&&(!text(s.inputSnapshot.currency,3)||!/^[A-Za-z]{3}$/.test(s.inputSnapshot.currency))||s.inputSnapshot.priceYear!==undefined&&!integer(s.inputSnapshot.priceYear,2000,2200))throw Error(`Scenario “${s.name}” contains an invalid calculation snapshot.`);snapshotAssetIds=uniqueIds(s.inputSnapshot.assets,`Scenario “${s.name}” snapshot assets`);snapshotTechnologyIds=uniqueIds(s.inputSnapshot.technologies,`Scenario “${s.name}” snapshot technology profiles`);for(const a of s.inputSnapshot.assets)validateAsset(a,`Scenario “${s.name}” snapshot`);for(const t of s.inputSnapshot.technologies)validateTechnology(t,`Scenario “${s.name}” snapshot`)}for(const [assetId,plan] of Object.entries(s.replacements||{})){if((!assets.has(assetId)&&!snapshotAssetIds.has(assetId))||!isObject(plan)||!integer(plan.year,Number(s.baseYearSnapshot??p.baseYear),Number(s.baseYearSnapshot??p.baseYear)+Number(s.horizonSnapshot??p.horizon)-1)||plan.technologyId&&!technologies.has(plan.technologyId)&&!snapshotTechnologyIds.has(plan.technologyId))throw Error(`Scenario “${s.name}” contains an invalid replacement assignment.`)}}
    }
    if(o.data.activeProjectId!==null&&o.data.activeProjectId!==undefined&&!projectIds.has(o.data.activeProjectId))throw Error('Backup active project does not exist in its project list.');
    return o.data;
  }

  const api={APP_VERSION,CALC_VERSION,MAX_STATE_CHARS,calc,parseCsv,csvValue,validateBackup,migrateLegacyFactor,migrateLegacyCosts};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  globalThis.GridshiftCore=api;
})();
