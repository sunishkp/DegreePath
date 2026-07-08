// src/app/recommendations/page.tsx
"use client";

import { useState } from "react";
import CourseRecommendationEngine from "../../components/courseRecEngine";

export default function RecommendationsPage() {
  // 1. Maintain tracking states for the isolated page view
  const [completedCourses, setCompletedCourses] = useState<string[]>([
    
  ]);
  const [specialization, setSpecialization] = useState<string>("ALL");
  const [currentQuarter, setCurrentQuarter] = useState<"Fall" | "Winter" | "Spring" | "Summer">("Fall");

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* PAGE BREADCRUMB / NAVIGATION CONTROL HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Course Analytics Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Isolated testing environment for algorithmic course matching and dependency graph visualization.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Term</label>
              <select 
                value={currentQuarter} 
                onChange={(e) => setCurrentQuarter(e.target.value as any)}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="Fall">Fall Term</option>
                <option value="Winter">Winter Term</option>
                <option value="Spring">Spring Term</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Track Focus</label>
              <select 
                value={specialization} 
                onChange={(e) => setSpecialization(e.target.value)}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 font-bold"
              >
                <option value="ALL">All Major Requirements</option>
                <option value="Bioinformatics">Bioinformatics</option>
                <option value="Information">Information</option>
                <option value="Intelligent">Intelligent Systems</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Embedded">Architecture and Embedded Systems</option>
                <option value="SystemsSoftware">Systems and Software</option>
                <option value="Network">Networked Systems</option>
                <option value="Computing">Visual Computing</option>
              </select>
            </div>
          </div>
        </div>

        <CourseRecommendationEngine 
          completedCourses={completedCourses}
          currentSpecialization={specialization}
          currentQuarter={currentQuarter}
          remainingUnitsNeeded={48}
        />

      </div>
    </main>
  );
}