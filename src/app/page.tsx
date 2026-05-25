"use client";

import Link from "next/link";

/* Main Page File */
export default function MainPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
      
      <div className="max-w-5xl w-full space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            DegreePath: Interactive Degree Planning System
          </h3>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Generate prerequisite-aware schedules, validate course eligibility, and estimate university costs through an interactive academic planning interface.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Card 1 */}
          <Link
            href="/planner"
            className= "group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start gap-4">

              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                📘
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Course & Schedule Planner
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Explore prerequisite requirements, dynamically unlock eligible courses, and visualize sample academic schedules.
                </p>

                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition">
                  Open →
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/tuition"
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start gap-4">

              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                💰
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tuition Calculator
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Estimate quarterly and annual university costs, including tuition, campus fees, and housing expenses.
                </p>

                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition">
                  Open →
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}