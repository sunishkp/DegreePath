"use client";

import Link from "next/link";

export default function MainPortal() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Student Academic & Financial Portal
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Select an independent tool below to audit your degree track or compute semester expenses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          
          {/* Card 1: Course Planner */}
          <Link 
            href="/planner"
            className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Course Planner</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Check off completed requirements, view real-time prerequisite warning messages, and see what classes you can take next.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              Open Course Planner &rarr;
            </div>
          </Link>

          {/* Card 2: Tuition Calculator */}
          <Link 
            href="/tuition"
            className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tuition Calculator</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Estimate campus enrollment fees, project costs by unit quantity, and plan out your upcoming semester budget.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              Open Tuition Calculator &rarr;
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}