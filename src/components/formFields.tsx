// src/components/TuitionCalculator/components/FormFields.tsx
import React, { ChangeEvent } from "react";
import { CalculatorState, CalculatorAction, TERMS, Residency, DegreeLevel, TermType, HousingType } from "../components/calculatorReducer";

interface FormFieldsProps {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}

export const FormFields = React.memo(function FormFields({ state, dispatch }: FormFieldsProps) {
  const { residency, degree, term, housing, isYearly, summerUnits } = state;

  return (
    <div className="space-y-6">
      {/* Step 1: Residency */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Residency</label>
        <select
          value={residency}
          onChange={(e) => dispatch({ type: "SET_RESIDENCY", payload: e.target.value as Residency })}
          className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
        >
          <option value="">-- Choose Residency --</option>
          <option value="IN_STATE">California Resident</option>
          <option value="OUT_OF_STATE">Non-California USA Resident</option>
          <option value="INTERNATIONAL">International</option>
        </select>
      </div>

      {/* Step 2: Degree Level */}
      {residency && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Degree Level</label>
          <select
            value={degree}
            onChange={(e) => dispatch({ type: "SET_DEGREE", payload: e.target.value as DegreeLevel })}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">-- Choose Degree Level --</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
      )}

      {/* Step 3: Term */}
      {degree && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Select Term</label>
          <select
            value={term}
            onChange={(e) => dispatch({ type: "SET_TERM", payload: e.target.value as TermType })}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">-- Choose Term --</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      {/* Step 4: Summer Units */}
      {term === "Summer" && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Summer Units</label>
          <input
            type="number"
            min={0}
            max={20}
            value={summerUnits}
            onChange={(e) => dispatch({ type: "SET_SUMMER_UNITS", payload: parseInt(e.target.value) || 0 })}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      )}

      {/* Step 5: Period toggle */}
      {term && term !== "Summer" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Billing View</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            <button
              type="button"
              className={`py-2 text-sm font-medium rounded-lg transition ${isYearly ? "bg-white dark:bg-gray-700 shadow text-blue-600 font-semibold" : "text-gray-500"}`}
              onClick={() => dispatch({ type: "SET_PERIOD", payload: true })}
            >
              Yearly
            </button>
            <button
              type="button"
              className={`py-2 text-sm font-medium rounded-lg transition ${!isYearly ? "bg-white dark:bg-gray-700 shadow text-blue-600 font-semibold" : "text-gray-500"}`}
              onClick={() => dispatch({ type: "SET_PERIOD", payload: false })}
            >
              Per Quarter
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Housing */}
      {term && (
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Housing Strategy</label>
          <select
            value={housing}
            onChange={(e) => dispatch({ type: "SET_HOUSING", payload: e.target.value as HousingType })}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">-- Choose Housing --</option>
            <option value="On-Campus">On-Campus</option>
            <option value="Off-Campus">Off-Campus</option>
            <option value="With Family">With Family</option>
          </select>
        </div>
      )}
    </div>
  );
});