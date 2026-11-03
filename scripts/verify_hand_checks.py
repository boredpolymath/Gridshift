#!/usr/bin/env python3
"""Independently reproduce the arithmetic examples in RELEASE_REVIEW_PACKET.md.

This checks arithmetic only. It does not validate the model's boundaries,
assumptions, source data, engineering suitability, or accounting treatment.
"""

from decimal import Decimal


gwp = Decimal("24300")
annual_leakage_kg = Decimal("1")
horizon_years = 2
baseline_annual_emissions = annual_leakage_kg * gwp
baseline_total_emissions = baseline_annual_emissions * horizon_years
baseline_npc = Decimal("150") * horizon_years

remaining_gas_kg = Decimal("10")
recovery_efficiency = Decimal("0.90")
unrecovered_gas_kg = remaining_gas_kg * (Decimal("1") - recovery_efficiency)
replacement_annual_emissions = Decimal("5")
scenario_first_year_emissions = unrecovered_gas_kg * gwp + replacement_annual_emissions
scenario_later_year_emissions = replacement_annual_emissions
scenario_total_emissions = scenario_first_year_emissions + scenario_later_year_emissions
avoided_emissions = baseline_total_emissions - scenario_total_emissions
replacement_capital_and_installation = Decimal("1000")
replacement_annual_om = Decimal("30")
scenario_npc = replacement_capital_and_installation + replacement_annual_om * horizon_years
incremental_npc = scenario_npc - baseline_npc

expected = {
    "baseline annual emissions (kg CO2e)": Decimal("24300"),
    "baseline total emissions (kg CO2e)": Decimal("48600"),
    "baseline NPC (USD)": Decimal("300"),
    "unrecovered SF6 (kg)": Decimal("1.00"),
    "replacement first-year emissions (kg CO2e)": Decimal("24305.00"),
    "replacement later-year emissions (kg CO2e)": Decimal("5"),
    "scenario total emissions (kg CO2e)": Decimal("24310.00"),
    "avoided emissions (kg CO2e)": Decimal("24290.00"),
    "scenario NPC (USD)": Decimal("1060"),
    "incremental NPC (USD)": Decimal("760"),
}
actual = {
    "baseline annual emissions (kg CO2e)": baseline_annual_emissions,
    "baseline total emissions (kg CO2e)": baseline_total_emissions,
    "baseline NPC (USD)": baseline_npc,
    "unrecovered SF6 (kg)": unrecovered_gas_kg,
    "replacement first-year emissions (kg CO2e)": scenario_first_year_emissions,
    "replacement later-year emissions (kg CO2e)": scenario_later_year_emissions,
    "scenario total emissions (kg CO2e)": scenario_total_emissions,
    "avoided emissions (kg CO2e)": avoided_emissions,
    "scenario NPC (USD)": scenario_npc,
    "incremental NPC (USD)": incremental_npc,
}

for label, value in actual.items():
    assert value == expected[label], f"{label}: expected {expected[label]}, got {value}"
    print(f"{label}: {value}")
print("Review-packet hand-check arithmetic passed; this is not a domain review.")
