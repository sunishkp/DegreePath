// src/components/TuitionCalculator/TuitionCalculator.tsx
"use client";

import { useReducer } from "react";
import { calculatorReducer, initialState } from "./calculatorReducer";
import { useFinancials } from "./useFinancials";
import { FormFields } from "../components/formFields";
import { LedgerSummary } from "../components/LedgerSummary";

export default function TuitionCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const financials = useFinancials(state);

  const isFormComplete = !!(state.residency && state.degree && state.term && state.housing);

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 space-y-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center tracking-tight">
        Tuition Calculator
      </h2>

      <FormFields state={state} dispatch={dispatch} />

      {isFormComplete && (
        <LedgerSummary 
          term={state.term} 
          isYearly={state.isYearly} 
          financials={financials} 
        />
      )}
    </div>
  );
}