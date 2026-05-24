// src/components/TuitionCalculator/useFinancials.ts
import { useMemo } from "react";
import { CalculatorState } from "./calculatorReducer";
import { TUITION_RATES, GRAD_TUITION_RATES, calculateSummerTuition } from "../config/tuition";
import { FEES, SUMMER_FEES } from "../config/fees";

const HOUSING_OPTIONS = { "On-Campus": 12000, "Off-Campus": 8000, "With Family": 0 } as const;
const ACADEMIC_QUARTERS_COUNT = 3;
const SUMMER_UNIT_CHARGE_CAP = 8;

export function useFinancials(state: CalculatorState) {
  const { residency, degree, term, housing, isYearly, summerUnits } = state;

  return useMemo(() => {
    if (!degree || !residency || !term) {
      return { tuition: 0, fees: 0, housingCost: 0, total: 0, breakdown: [] };
    }

    let tuition = 0;
    if (term === "Summer") {
      tuition = calculateSummerTuition(degree, summerUnits);
    } else {
      const base = degree === "Graduate" ? GRAD_TUITION_RATES[residency] : TUITION_RATES[residency];
      tuition = isYearly ? base : base / ACADEMIC_QUARTERS_COUNT;
    }

    let fees = 0;
    const breakdown: Array<{ name: string; cost: number }> = [];

    if (term !== "Summer") {
      const degreeKey = degree === "Undergraduate" ? "UNDERGRAD" : "GRAD";
      const feeSet = FEES[degreeKey] || [];
      feeSet.forEach((fee) => {
        const cost = isYearly ? fee.amount : fee.amount / ACADEMIC_QUARTERS_COUNT;
        fees += cost;
        breakdown.push({ name: fee.name, cost });
      });
    } else {
      const summerFeeSet = degree === "Graduate" ? SUMMER_FEES.GRAD : SUMMER_FEES.UNDERGRAD;
      const unitsToCharge = Math.min(summerUnits, SUMMER_UNIT_CHARGE_CAP);
      summerFeeSet.forEach((fee) => {
        const cost = fee.perUnit ? fee.amount * unitsToCharge : fee.amount;
        fees += cost;
        breakdown.push({ name: fee.name, cost });
      });
    }

    const housingCost = housing
      ? isYearly
        ? HOUSING_OPTIONS[housing]
        : HOUSING_OPTIONS[housing] / ACADEMIC_QUARTERS_COUNT
      : 0;

    return {
      tuition,
      fees,
      housingCost,
      total: tuition + fees + housingCost,
      breakdown,
    };
  }, [residency, degree, term, housing, isYearly, summerUnits]);
}