"use client";

import { useState } from "react";
import { runDegreeAudit } from "../lib/degreeaudit";

export default function AuditPage() {
  const [completedInput, setCompletedInput] = useState(
    "ICS31, ICS32, CS113, CS114, CS162"
  );

  const [specialization, setSpecialization] = useState("Algorithms");

  const completedCourses = completedInput
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const result = runDegreeAudit(completedCourses, specialization);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Degree Audit System
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track progress across core, upper-division, project, and specialization requirements.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Completed Courses (comma separated)
            </label>
            <input
              value={completedInput}
              onChange={(e) => setCompletedInput(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white"
            >
              <option value="Algorithms">Algorithms</option>
              <option value="EmbeddedSystems">Embedded Systems</option>
              <option value="Bioinformatics">Bioinformatics</option>
              <option value="Information">Information</option>
              <option value="IntelligentSystems">Intelligent Systems</option>
              <option value="NetworkedSystems">Networked Systems</option>
              <option value="SystemsSoftware">Systems Software</option>
              <option value="VisualComputing">Visual Computing</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-4">

          <Card title="Core Requirements" data={result.core} />

          <Card title="Upper Division (11 required)" data={result.upperDiv} />

          <Card title="Project Courses (2 required)" data={result.projects} />

          {result.specialization && (
            <Card
              title="Specialization"
              data={result.specialization}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Card Component
========================= */
function Card({
  title,
  data,
}: {
  title: string;
  data: any;
}) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>

      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p>
          <span className="font-medium">Completed:</span>{" "}
          {data.completedCount}
        </p>

        {data.required !== undefined && (
          <p>
            <span className="font-medium">Required:</span>{" "}
            {data.required}
          </p>
        )}

        {data.remaining !== undefined && (
          <p>
            <span className="font-medium">Remaining:</span>{" "}
            {data.remaining}
          </p>
        )}

        <p>
          <span className="font-medium">Status:</span>{" "}
          {data.complete ? "✅ Complete" : "❌ In Progress"}
        </p>
      </div>
    </div>
  );
}