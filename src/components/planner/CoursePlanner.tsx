"use client";

import { useState } from "react";
import { COURSES } from "../../data/courses";
import { getAvailableCourses } from "../../engine/getAvailableCourses";
import AvailableCoursesList from "../../data/AvailableCourseList"; 

export default function CoursePlanner() {
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [errorState, setErrorState] = useState<{ courseId: string; message: string } | null>(null);

  const toggleCourse = (courseId: string) => {
    // Clear any existing error state on action
    setErrorState(null);

    const isCurrentlyCompleted = completedCourses.includes(courseId);

    if (isCurrentlyCompleted) {
      // Logic for unchecking: Remove it from completed list
      setCompletedCourses((prev) => prev.filter((id) => id !== courseId));
    } else {
      // Logic for checking: Find the target course data
      const currentCourse = COURSES.find((c) => c.id === courseId);
      
      // Safety check if your course model uses an array like `prerequisites` or `prereqs`
      // Swap out `.prerequisites` below if your data scheme names it differently
      const prerequisites = currentCourse?.prerequisites || [];

      // Check if all prerequisites are satisfied in the current completed array
      const missingPrereqs = prerequisites.filter((reqId) => !completedCourses.includes(reqId));

      if (missingPrereqs.length > 0) {
        // Trigger validation block and show error
        setErrorState({
          courseId,
          message: `Prerequisite required: ${missingPrereqs.join(", ")}`,
        });
        return; // Halt selection
      }

      // If validation passes, add to completed list
      setCompletedCourses((prev) => [...prev, courseId]);
    }
  };

  const availableCourses = getAvailableCourses(completedCourses);

  return (
    <div className="w-full space-y-4 max-w-4xl mx-auto">
      {/* Container Box */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden text-sm">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Course Planner Tracker
          </h3>
        </div>

        {/* Dynamic Warning Alert Box */}
        {errorState && (
          <div className="mx-4 mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-lg flex items-center gap-2.5 text-xs animate-fade-in">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="font-medium">
              <span className="font-bold uppercase tracking-wider bg-rose-200/50 dark:bg-rose-900/50 px-1 py-0.5 rounded text-[10px] mr-1.5">{errorState.courseId}</span> 
              {errorState.message}
            </div>
          </div>
        )}

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <span>Completed Courses Checklist</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
              {completedCourses.length} Taken
            </span>
          </div>

          {/* Completed grid layout with space padding at bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1 pb-4">
            {COURSES.map((course) => {
              const isCompleted = completedCourses.includes(course.id);
              const hasError = errorState?.courseId === course.id;
              
              return (
                <button
                  key={course.id}
                  onClick={() => toggleCourse(course.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all text-xs ${
                    isCompleted
                      ? "bg-indigo-50/60 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 shadow-2xs"
                      : hasError 
                        ? "bg-rose-50/40 border-rose-300 dark:bg-rose-950/20 dark:border-rose-900 text-gray-700 dark:text-gray-300 ring-2 ring-rose-500/20"
                        : "bg-white border-gray-100 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className={`font-bold mr-1.5 ${isCompleted ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
                      {course.id}
                    </span>
                    <span className="opacity-95">{course.name}</span>
                  </div>
                  
                  {/* Action box checkbox */}
                  <div className={`shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                    isCompleted 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : hasError
                        ? "border-rose-400 bg-rose-100 dark:bg-rose-950"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800"
                  }`}>
                    {isCompleted && (
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sub-Component handles displaying eligible courses dynamically beneath or near the setup */}
      <AvailableCoursesList courses={availableCourses} />
    </div>
  );
}