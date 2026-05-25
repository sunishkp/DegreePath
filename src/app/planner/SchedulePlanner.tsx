"use client";

import { generateSchedule } from "../../engine/scheduleGenerator";
import { COURSES } from "../../data/courses";

export default function CoursePlanner() {

  const schedule = generateSchedule(
    COURSES,
    [], // completed courses
    12, // max units
  );

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Course Planner
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Generate prerequisite-aware academic schedules.
        </p>
      </div>

      {/* Schedule Display */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {Object.entries(schedule).map(([quarter, courses]) => (
          <div
            key={quarter}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 shadow-sm"
          >
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
              {quarter}
            </h2>

            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {course.id}
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {course.name}
                  </div>

                  <div className="text-xs mt-1 text-indigo-600 dark:text-indigo-400">
                    {course.units} Units
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}