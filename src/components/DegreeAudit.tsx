"use client";

import { useMemo, useState } from "react";

import { runDegreeAudit } from "../lib/degreeaudit";
import { DEGREE_REQUIREMENTS } from "../data/degreeRequirements";
import { COURSES } from "../data/courses";

export default function DegreeAudit() {
  const [completedInput, setCompletedInput] = useState("");
  const [showRemainingCore, setShowRemainingCore] = useState(false);
  const [showRemainingSpec, setShowRemainingSpec] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("Algorithms");

  // Normalized array of raw user-input courses
  const completedCourses = useMemo(
    () =>
      completedInput
        .split(",")
        .map((c) => c.replace(/\s+/g, "").toUpperCase())
        .filter(Boolean),
    [completedInput]
  );

  // Run the full core, upper-division, project, and specialization audit checks
  const audit = useMemo(() => {
    return runDegreeAudit(completedCourses, selectedSpecialization);
  }, [completedCourses, selectedSpecialization]);

  // Map courses lookup structure for constant time prerequisite checking
  const coursesMap = useMemo(() => {
    const map: Record<string, { prerequisites: string[]; name: string }> = {};
    COURSES.forEach((course) => {
      map[course.id.toUpperCase()] = {
        name: course.name,
        prerequisites: course.prerequisites.map((p) => p.replace(/\s+/g, "").toUpperCase()),
      };
    });
    return map;
  }, []);

  /*
    Identify courses inputted where prerequisites were not satisfied beforehand
  */
  const prerequisiteWarnings = useMemo(() => {
    const warnings: { course: string; missing: string[] }[] = [];

    completedCourses.forEach((course) => {
      const courseInfo = coursesMap[course];
      if (courseInfo && courseInfo.prerequisites.length > 0) {
        const missingPrereqs = courseInfo.prerequisites.filter(
          (prereq) => !completedCourses.includes(prereq)
        );
        if (missingPrereqs.length > 0) {
          warnings.push({
            course,
            missing: missingPrereqs,
          });
        }
      }
    });

    return warnings;
  }, [completedCourses, coursesMap]);

  /*
    Remaining core classes
  */
  const remainingCore = DEGREE_REQUIREMENTS.core.filter(
    (course) => !completedCourses.includes(course.replace(/\s+/g, "").toUpperCase())
  );

  /*
    Courses whose prerequisites are fully satisfied
  */
  const eligibleCoreCourses = remainingCore.filter((course) => {
    const courseInfo = coursesMap[course.replace(/\s+/g, "").toUpperCase()];
    if (!courseInfo) return true;
    const prereqs = courseInfo.prerequisites;
    return prereqs.every((prereq: string) => completedCourses.includes(prereq));
  });

  // Fetch current rules for selected specialization
  const currentSpecRules = DEGREE_REQUIREMENTS.specializations[
    selectedSpecialization as keyof typeof DEGREE_REQUIREMENTS.specializations
  ];

  // Calculate remaining specialization items
  const remainingSpecCourses = useMemo(() => {
    if (!currentSpecRules) return { mandatory: [], electives: [] };

    const missingMandatory = currentSpecRules.mandatory.filter(
      (course) => !completedCourses.includes(course.replace(/\s+/g, "").toUpperCase())
    );

    const missingElectives = currentSpecRules.electives.filter(
      (course) => !completedCourses.includes(course.replace(/\s+/g, "").toUpperCase())
    );

    return {
      mandatory: missingMandatory,
      electives: missingElectives,
    };
  }, [currentSpecRules, completedCourses]);

  // Specialization Track Progress Calculation (Enforcing Mandatory Requirements)
  const specAuditDetails = useMemo(() => {
    if (!currentSpecRules) return { completedCount: 0, totalNeeded: 0, allMandatoryDone: false, isComplete: false };

    const normMandatory = currentSpecRules.mandatory.map((c) => c.replace(/\s+/g, "").toUpperCase());
    const normElectives = currentSpecRules.electives.map((c) => c.replace(/\s+/g, "").toUpperCase());

    const completedMandatory = normMandatory.filter((c) => completedCourses.includes(c));
    const completedElectives = normElectives.filter((c) => completedCourses.includes(c));

    const allMandatoryDone = completedMandatory.length === normMandatory.length;
    
    // Total courses counting toward fulfillment (capped at maximum required elective slots + mandatory slots)
    const validElectivesCount = Math.min(currentSpecRules.electiveCount, completedElectives.length);
    const totalCompletedTrack = completedMandatory.length + validElectivesCount;
    const totalNeededTrack = normMandatory.length + currentSpecRules.electiveCount;

    return {
      completedCount: totalCompletedTrack,
      totalNeeded: totalNeededTrack,
      allMandatoryDone,
      isComplete: allMandatoryDone && validElectivesCount >= currentSpecRules.electiveCount,
    };
  }, [currentSpecRules, completedCourses]);

  // Overall graduation readiness checker
  const isReadyToGraduate = useMemo(() => {
    const coreComplete = audit.core.complete;
    const upperDivComplete = audit.upperDiv.complete;
    const projectsComplete = audit.projects.complete;
    const specializationComplete = specAuditDetails.isComplete;
    const noWarnings = prerequisiteWarnings.length === 0;

    return coreComplete && upperDivComplete && projectsComplete && specializationComplete && noWarnings;
  }, [audit, specAuditDetails, prerequisiteWarnings]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-8 antialiased bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Degree Audit Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Track milestones and required courses to verify graduation eligibility.
          </p>
        </div>
      </div>

      {/* Graduation Status Banner */}
      {isReadyToGraduate ? (
        <div className="rounded-xl p-6 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white shadow-md border border-emerald-400/20 animate-fade-in animate-bounce-subtle">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg text-2xl">🎓</div>
            <div>
              <h2 className="text-xl font-bold">Congratulations! You are ready to graduate!</h2>
              <p className="text-sm text-emerald-50/90 mt-0.5 font-medium">
                All core tracks, upper-division distributions, project specifications, and track-mandatory specializations have been fulfilled.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-4 bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 flex items-start gap-3 text-sm">
          <span className="text-base mt-0.5">ℹ️</span>
          <div>
            <span className="font-semibold text-blue-900 dark:text-blue-200">Degree In Progress:</span> Complete outstanding core elements, specialized electives, and fulfill missing track requirements shown below to unlock graduation approval.
          </div>
        </div>
      )}

      {/* Select Track Option */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <label htmlFor="specialization-select" className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          CS Degree Specialization Track
        </label>
        <select
          id="specialization-select"
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
        >
          {Object.keys(DEGREE_REQUIREMENTS.specializations).map((specName) => (
            <option key={specName} value={specName}>
              {specName.replace(/([A-Z])/g, " $1").trim()}
            </option>
          ))}
        </select>
      </div>

      {/* Input Field & Warnings */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <label htmlFor="completed-courses-input" className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Courses Completed
        </label>
        <textarea
          id="completed-courses-input"
          value={completedInput}
          onChange={(e) => setCompletedInput(e.target.value)}
          placeholder="e.g., ICS31, ICS32, ICS33, MATH2A, ICS6B"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-gray-50/50 dark:bg-gray-900/30 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y font-mono text-sm"
          rows={4}
        />
        
        {/* Warning messages */}
        {prerequisiteWarnings.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300 space-y-1.5 text-sm">
            <h4 className="font-bold flex items-center gap-2 text-amber-800 dark:text-amber-200">
              ⚠️ Prerequisite Warning
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400">The following classes can't be taken without the completion of these required courses:</p>
            <ul className="list-disc list-inside space-y-1 pl-1 font-medium">
              {prerequisiteWarnings.map((warning, index) => (
                <li key={index} className="text-xs">
                  <span className="underline decoration-amber-400">{warning.course}</span> requires missing baseline: <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">{warning.missing.join(", ")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Summary Audit Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AuditCard
          title="Core Curriculum"
          completed={audit.core.completedCount}
          total={audit.core.total}
        />
        <AuditCard
          title="Upper Div Electives"
          completed={audit.upperDiv.completedCount}
          total={audit.upperDiv.required}
        />
        <AuditCard
          title="Project Courses"
          completed={audit.projects.completedCount}
          total={audit.projects.required}
        />
        <AuditCard
          title={`${selectedSpecialization.replace(/([A-Z])/g, " $1").trim()} Track`}
          completed={specAuditDetails.completedCount}
          total={specAuditDetails.totalNeeded}
          color="bg-emerald-600"
          accentText={!specAuditDetails.allMandatoryDone && completedCourses.length > 0 ? "Mandatory Missing" : undefined}
        />
      </div>

      {/* Recommender Segment */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h2 className="text-md font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-xs mb-2">
          Recommended Next Core Options
        </h2>

        {eligibleCoreCourses.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            Choosing between multiple courses? 
            Visit the <span className="font-semibold text-blue-600 dark:text-blue-400">Course Recommendation Engine</span> to 
            compare your options and determine which course unlocks the most future prequisites and opppurtunities, so that you can prioritize it first. 
          </p>
        )}

        {eligibleCoreCourses.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm italic">
            No remaining core options unlocked. Fulfill introductory core courses to clear upcoming prerequisites.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {eligibleCoreCourses.map((course) => (
              <span
                key={course}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border border-green-200/60 dark:border-green-900/60 font-mono shadow-xs"
              >
                {course}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Remaining Core Accordion Dropdown */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => setShowRemainingCore(!showRemainingCore)}
          className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
        >
          <span className="text-sm tracking-tight">
            Remaining Core Requirements ({remainingCore.length})
          </span>
          <span className="text-gray-400 text-xs">{showRemainingCore ? "▲" : "▼"}</span>
        </button>

        {showRemainingCore && (
          <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700/80 pt-4 bg-gray-50/40 dark:bg-gray-900/10">
            {remainingCore.length === 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">✨ All core curriculum benchmarks fully satisfied!</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {remainingCore.map((course) => {
                  const courseIdNorm = course.replace(/\s+/g, "").toUpperCase();
                  const courseInfo = coursesMap[courseIdNorm];
                  const prereqs = courseInfo?.prerequisites ?? [];
                  const unlocked = prereqs.every((p: string) => completedCourses.includes(p));

                  return (
                    <div key={course} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-xs">
                      <div className="font-bold text-gray-900 dark:text-white font-mono text-sm">{course}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{courseInfo?.name ?? "General Requirement"}</div>
                      <div className="text-[11px] font-bold mt-2">
                        {unlocked ? (
                          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">Eligible</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">Locked (Prereqs Required)</span>
                        )}
                      </div>
                      {prereqs.length > 0 && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/60 font-mono">
                          Prereqs: {prereqs.join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Remaining Specialization Tracks Dropdown Accordion */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => setShowRemainingSpec(!showRemainingSpec)}
          className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
        >
          <span className="text-sm tracking-tight">
            Remaining {selectedSpecialization.replace(/([A-Z])/g, " $1").trim()} Track Breakdown ({remainingSpecCourses.mandatory.length + remainingSpecCourses.electives.length})
          </span>
          <span className="text-gray-400 text-xs">{showRemainingSpec ? "▲" : "▼"}</span>
        </button>

        {showRemainingSpec && (
          <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700/80 pt-4 bg-gray-50/40 dark:bg-gray-900/10 space-y-5">
            
            {/* Mandatory Sub-Section */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Mandatory Requirements (Must Take All)
                </h4>
                {specAuditDetails.allMandatoryDone ? (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded dark:bg-emerald-950/20">All Cleared</span>
                ) : (
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded dark:bg-red-950/20">Action Required</span>
                )}
              </div>
              
              {remainingSpecCourses.mandatory.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">No remaining mandatory requirements left.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {remainingSpecCourses.mandatory.map((course) => {
                    const courseIdNorm = course.replace(/\s+/g, "").toUpperCase();
                    const courseInfo = coursesMap[courseIdNorm];
                    const prereqs = courseInfo?.prerequisites ?? [];
                    const unlocked = prereqs.every((p: string) => completedCourses.includes(p));

                    return (
                      <div key={course} className="rounded-lg border border-red-100 dark:border-red-950/30 p-3 bg-white dark:bg-gray-800 shadow-xs">
                        <div className="font-bold text-gray-900 dark:text-white font-mono text-sm flex justify-between items-center">
                          <span>{course}</span>
                          <span className="text-[9px] uppercase tracking-wide bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 px-1 rounded font-sans">Required</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{courseInfo?.name ?? "Required Specialization Block"}</div>
                        <div className="text-[11px] font-bold mt-2">
                          {unlocked ? (
                            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">Eligible Now</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">Locked</span>
                          )}
                        </div>
                        {prereqs.length > 0 && (
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/60 font-mono">
                            Prereqs: {prereqs.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Electives Sub-Section */}
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Track Electives (Choose {currentSpecRules?.electiveCount ?? 0})
                </h4>
              </div>

              {remainingSpecCourses.electives.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">No remaining elective options available.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {remainingSpecCourses.electives.map((course) => {
                    const courseIdNorm = course.replace(/\s+/g, "").toUpperCase();
                    const courseInfo = coursesMap[courseIdNorm];
                    const prereqs = courseInfo?.prerequisites ?? [];
                    const unlocked = prereqs.every((p: string) => completedCourses.includes(p));

                    return (
                      <div key={course} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-xs">
                        <div className="font-bold text-gray-900 dark:text-white font-mono text-sm">{course}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{courseInfo?.name ?? "Track Option Elective"}</div>
                        <div className="text-[11px] font-bold mt-2">
                          {unlocked ? (
                            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">Eligible Now</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">Locked</span>
                          )}
                        </div>
                        {prereqs.length > 0 && (
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/60 font-mono">
                            Prereqs: {prereqs.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
  Reusable Custom Audit Metrics Cards Component 
*/
function AuditCard({
  title,
  completed,
  total,
  color = "bg-blue-600",
  accentText,
}: {
  title: string;
  completed: number;
  total: number;
  color?: string;
  accentText?: string;
}) {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-xs relative overflow-hidden">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{title}</h3>
        {accentText && (
          <span className="text-[9px] bg-red-50 text-red-600 font-bold px-1 rounded dark:bg-red-950/30 dark:text-red-400 tracking-wide">
            {accentText}
          </span>
        )}
      </div>

      <div className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
        {completed}<span className="text-gray-300 dark:text-gray-600 text-lg font-normal">/{total}</span>
      </div>

      <div className="w-full bg-gray-100 dark:bg-gray-700/60 rounded-full h-1.5 mt-4 overflow-hidden">
        <div
          className={`${color} h-1.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-bold tracking-wide uppercase">
        {percentage}% Fulfilled
      </p>
    </div>
  );
}