"use client";

import { useState } from "react";
import { COURSES } from "../../data/courses";
import { getAvailableCourses } from "../../engine/getAvailableCourses";
import AvailableCoursesList from "../../data/AvailableCourseList";
import { generateSchedule } from "../../engine/scheduleGenerator";

export default function CoursePlanner() {
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [showChecklist, setShowChecklist] = useState(true);

  const [currentYear, setCurrentYear] = useState(1);

  const [currentQuarter, setCurrentQuarter] = useState<
    "Fall" | "Winter" | "Spring" | "Summer"
  >("Fall");

  const [errorState, setErrorState] = useState<{
    courseId: string;
    message: string;
  } | null>(null);

  const [optimizationMode, setOptimizationMode] =
  useState<
    "FASTEST" | "BALANCED" | "LIGHTWEIGHT" | "INTERNSHIP" | "SUMMER"
  >("BALANCED");

  const toggleCourse = (courseId: string) => {
    setErrorState(null);

    const isCurrentlyCompleted = completedCourses.includes(courseId);

    if (isCurrentlyCompleted) {
      setCompletedCourses((prev) =>
        prev.filter((id) => id !== courseId)
      );
    } else {
      const currentCourse = COURSES.find((c) => c.id === courseId);

      const prerequisites = currentCourse?.prerequisites || [];

      const missingPrereqs = prerequisites.filter(
        (reqId) => !completedCourses.includes(reqId)
      );

      if (missingPrereqs.length > 0) {
        setErrorState({
          courseId,
          message: `Prerequisite required: ${missingPrereqs.join(", ")}`,
        });

        return;
      }

      setCompletedCourses((prev) => [...prev, courseId]);
    }
  };

  const availableCourses =
    getAvailableCourses(completedCourses);

  const generatedSchedule = generateSchedule(
    COURSES,
    completedCourses,
    12,
    currentYear,
    currentQuarter,
    optimizationMode
  );

  return (
    <div className="w-full space-y-4 max-w-7xl mx-auto">

      {/* COURSE CHECKLIST */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden text-sm">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">

            <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>

              Course Planner Tracker
            </h3>

            <button
              onClick={() =>
                setShowChecklist((prev) => !prev)
              }
              className="text-xs font-medium px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              {showChecklist
                ? "Hide Checklist"
                : "Show Checklist"}
            </button>

          </div>
        </div>

        {/* Error Alert */}
        {errorState && (
          <div className="mx-4 mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2.5 text-xs">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <div className="font-medium">
              <span className="font-bold uppercase tracking-wider bg-rose-200/50 dark:bg-rose-900/50 px-1 py-0.5 rounded text-[10px] mr-1.5">
                {errorState.courseId}
              </span>

              {errorState.message}
            </div>
          </div>
        )}

        {/* Collapsible Checklist */}
        {showChecklist && (
          <div className="p-4 space-y-3">

            <div className="flex justify-between items-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <span>Completed Courses Checklist</span>

              <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                {completedCourses.length} Taken
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1 pb-4">

              {COURSES.map((course) => {
                const isCompleted =
                  completedCourses.includes(course.id);

                const hasError =
                  errorState?.courseId === course.id;

                return (
                  <button
                    key={course.id}
                    onClick={() =>
                      toggleCourse(course.id)
                    }
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all text-xs ${
                      isCompleted
                        ? "bg-indigo-50/60 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200"
                        : hasError
                        ? "bg-rose-50/40 border-rose-300 dark:bg-rose-950/20 dark:border-rose-900 text-gray-700 dark:text-gray-300"
                        : "bg-white border-gray-100 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >

                    <div className="truncate mr-2">
                      <span
                        className={`font-bold mr-1.5 ${
                          isCompleted
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-400"
                        }`}
                      >
                        {course.id}
                      </span>

                      <span>{course.name}</span>
                    </div>

                    <div
                      className={`shrink-0 h-4 w-4 rounded border flex items-center justify-center ${
                        isCompleted
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : hasError
                          ? "border-rose-400 bg-rose-100 dark:bg-rose-950"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800"
                      }`}
                    >
                      {isCompleted && (
                        <svg
                          className="w-2.5 h-2.5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </div>

                  </button>
                );
              })}

            </div>
          </div>
        )}
      </div>

      {/* AVAILABLE COURSES */}
      <AvailableCoursesList
        courses={availableCourses}
      />

      {/* CURRENT POSITION */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden text-sm">

        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">
            Academic Status
          </h3>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Year */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Start Year
            </label>

            <select
              value={currentYear}
              onChange={(e) =>
                setCurrentYear(Number(e.target.value))
              }
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-2"
            >
              <option value={1}>Year 1</option>
              <option value={2}>Year 2</option>
              <option value={3}>Year 3</option>
              <option value={4}>Year 4</option>
            </select>
          </div>

          {/* Quarter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Start Quarter
            </label>

            <select
              value={currentQuarter}
              onChange={(e) =>
                setCurrentQuarter(
                  e.target.value as
                    | "Fall"
                    | "Winter"
                    | "Spring"
                    | "Summer"
                )
              }
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-2"
            >
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
            </select>
          </div>

        </div>
      </div>

      {/* Optimization Mode */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Optimization Mode
        </label>

        <select
          value={optimizationMode}
          onChange={(e) =>
            setOptimizationMode(
              e.target.value as
                | "FASTEST"
                | "BALANCED"
                | "LIGHTWEIGHT"
            )
          }
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-2"
        >
          <option value="FASTEST">
            Fastest Graduation
          </option>

          <option value="BALANCED">
            Balanced Workload
          </option>

          <option value="LIGHTWEIGHT">
            Lightweight Quarters
          </option>

          <option value="INTERNSHIP">
            Internship Friendly (Off-Season)
          </option>

          <option value="SUMMER">
            Maximize Summer
          </option>

        </select>
      </div>

      {/* ROADMAP */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Sample Roadmap
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Automatically generated prerequisite-aware graduation path for each quarter left.
          </p>
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto pb-4 rounded-2xl bg-gray-50 dark:bg-gray-950">
          <div className="flex items-start gap-8 px-6 py-8 w-max">

            {Object.entries(generatedSchedule).map(
              ([quarter, courses]) => {

                const totalUnits = courses.reduce(
                  (sum, course) =>
                    sum + course.units,
                  0
                );

                return (
                  <div
                    key={quarter}
                    className="relative w-[340px] shrink-0"
                  >

                    {/* Connector */}
                    <div className="absolute top-7 -right-4 w-8 h-[2px] bg-gray-300 dark:bg-gray-700" />

                    {/* Quarter Card */}
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shadow-sm overflow-hidden">

                      {/* Quarter Header */}
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex items-center justify-between">

                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {quarter}
                            </h4>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {courses.length} Courses
                            </p>
                          </div>

                          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                            {totalUnits} Units
                          </div>

                        </div>
                      </div>

                      {/* Course Stack */}
                      <div className="p-4 space-y-3">

                        {courses.length === 0 ? (
                          <div className="text-sm text-gray-400 italic">
                            No scheduled courses
                          </div>
                        ) : (
                          courses.map((course) => (
                            <div
                              key={course.id}
                              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-md transition-all"
                            >

                              <div className="flex items-start justify-between gap-3">

                                <div>
                                  <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                    {course.id}
                                  </div>

                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {course.name}
                                  </div>
                                </div>

                                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                  {course.units}u
                                </div>

                              </div>
                            </div>
                          ))
                        )}

                      </div>
                    </div>
                  </div>
                );
              }
            )}

          </div>
        </div>
      </div>
    </div>
  );
}