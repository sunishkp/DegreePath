// src/components/TuitionCalculator/calculatorReducer.ts
import { TUITION_RATES, GRAD_TUITION_RATES, calculateSummerTuition } from "../config/tuition";

export const TERMS = ["Fall", "Winter", "Spring", "Summer"] as const;

export type Residency = keyof typeof TUITION_RATES;
export type DegreeLevel = "Undergraduate" | "Graduate";
export type TermType = typeof TERMS[number];
export type HousingType = "On-Campus" | "Off-Campus" | "With Family";

export interface CalculatorState {
  residency: Residency | "";
  degree: DegreeLevel | "";
  term: TermType | "";
  housing: HousingType | "";
  isYearly: boolean;
  summerUnits: number;
}

export type CalculatorAction =
  | { type: "SET_RESIDENCY"; payload: Residency | "" }
  | { type: "SET_DEGREE"; payload: DegreeLevel | "" }
  | { type: "SET_TERM"; payload: TermType | "" }
  | { type: "SET_HOUSING"; payload: HousingType | "" }
  | { type: "SET_PERIOD"; payload: boolean }
  | { type: "SET_SUMMER_UNITS"; payload: number };

export const initialState: CalculatorState = {
  residency: "",
  degree: "",
  term: "",
  housing: "",
  isYearly: true,
  summerUnits: 0,
};

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case "SET_RESIDENCY":
      return { ...initialState, residency: action.payload };
    case "SET_DEGREE":
      return { ...initialState, residency: state.residency, degree: action.payload };
    case "SET_TERM":
      return { 
        ...state, 
        term: action.payload, 
        housing: "", 
        summerUnits: 0,
        isYearly: action.payload === "Summer" ? false : state.isYearly 
      };
    case "SET_HOUSING":
      return { ...state, housing: action.payload };
    case "SET_PERIOD":
      return { ...state, isYearly: action.payload };
    case "SET_SUMMER_UNITS":
      return { ...state, summerUnits: action.payload };
    default:
      return state;
  }
}