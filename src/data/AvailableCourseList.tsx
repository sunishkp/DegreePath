"use client";

interface Course {
  id: string;
  name: string;
  units: number;
  offered: string[];
}

interface AvailableCoursesListProps {
  courses: Course[];
}

export default function AvailableCoursesList({ courses }: AvailableCoursesListProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden text-sm">
      <div className="p-4 space-y-3 bg-gray-50/30 dark:bg-gray-900/20">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <span>Available to Take Next</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            {courses.length} Unlocked
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              No new courses unlocked yet.
            </p>
            <p className="text-[11px] text-gray-400/70 dark:text-gray-500/70 mt-0.5">
              Complete baseline requirement prerequisites above first.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 pb-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-2.5 rounded-lg border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-2xs hover:border-emerald-200 dark:hover:border-emerald-900/60 transition-colors text-xs flex items-center justify-between gap-3"
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{course.id}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-800 px-1.5 py-0.25 rounded">
                      {course.offered.join(", ")}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 truncate font-medium">{course.name}</div>
                </div>

                <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/40 dark:border-gray-700">
                  {course.units}u
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}