// src/components/TuitionCalculator/components/LedgerSummary.tsx
import { useState } from "react";

interface LedgerSummaryProps {
  term: string;
  isYearly: boolean;
  financials: {
    tuition: number;
    fees: number;
    housingCost: number;
    total: number;
    breakdown: Array<{ name: string; cost: number }>;
  };
}

export function LedgerSummary({ term, isYearly, financials }: LedgerSummaryProps) {
  const [showFees, setShowFees] = useState(false);
  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Tuition ({term === "Summer" ? "Summer Term" : isYearly ? "Yearly" : "Per Quarter"})</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(financials.tuition)}</span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          Campus Fees
          <button
            type="button"
            className="w-4 h-4 inline-flex items-center justify-center text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            onClick={() => setShowFees(!showFees)}
          >
            ?
          </button>
        </span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(financials.fees)}</span>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Housing Allocation</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(financials.housingCost)}</span>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />
      
      <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-gray-50">
        <span>Estimated Total</span>
        <span className="text-blue-600 dark:text-blue-400">{formatCurrency(financials.total)}</span>
      </div>

      {showFees && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-1.5 animate-fadeIn">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Itemized Fees</h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {financials.breakdown.map((item) => (
              <li key={item.name} className="flex justify-between">
                <span>{item.name}</span>
                <span>{formatCurrency(item.cost)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}