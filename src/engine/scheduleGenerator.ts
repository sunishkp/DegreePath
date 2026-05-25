// src/engine/scheduleGenerator.ts

export type Quarter = "Fall" | "Winter" | "Spring" | "Summer";

export type Course = {
  id: string;
  name: string;
  units: number;
  prerequisites: string[];
  offered: Quarter[];
};

export type Schedule = {
  [quarter: string]: Course[];
};

/**
 * Checks whether a student can take a course
 * based on completed prerequisites.
 */
function canTakeCourse(
  course: Course,
  completedCourses: Set<string>
): boolean {
  return course.prerequisites.every((prereq) =>
    completedCourses.has(prereq)
  );
}

/**
 * Generates a multi-quarter academic schedule.
 */
export function generateSchedule(
  allCourses: Course[],
  completedCourseIds: string[],
  maxUnitsPerQuarter: number,
  startingYear = 1,
  startingQuarter: Quarter = "Fall",
  maxYears: number = 4
): Schedule {
  const schedule: Schedule = {};

  // Fast lookup for completed courses
  const completed = new Set<string>(completedCourseIds);

  // Courses still needing completion
  let remainingCourses = allCourses.filter(
    (course) => !completed.has(course.id)
  );

  const quarters: Quarter[] = ["Fall", "Winter", "Spring"];

  let year = startingYear;
  let quarterIndex = quarters.indexOf(startingQuarter) + 1;

  // Continue until all courses scheduled
  // OR maximum year limit reached
  while (
    remainingCourses.length > 0 &&
    year <= maxYears
  ) {
    const currentQuarter =
      quarters[quarterIndex % quarters.length];

    const quarterKey = `Year ${year} - ${currentQuarter}`;

    let unitsUsed = 0;

    const selectedCourses: Course[] = [];

    // Find courses available THIS quarter
    // whose prerequisites are satisfied
    const availableCourses = remainingCourses.filter(
      (course) =>
        canTakeCourse(course, completed) &&
        course.offered.includes(currentQuarter)
    );

    // Greedily fill quarter until unit cap
    for (const course of availableCourses) {
      if (
        unitsUsed + course.units <=
        maxUnitsPerQuarter
      ) {
        selectedCourses.push(course);

        unitsUsed += course.units;
      }
    }

    // Mark scheduled courses as completed
    for (const course of selectedCourses) {
      completed.add(course.id);
    }

    // Remove completed courses
    remainingCourses = remainingCourses.filter(
      (course) => !completed.has(course.id)
    );

    // Save quarter schedule
    schedule[quarterKey] = selectedCourses;

    quarterIndex++;

    // Every 3 quarters -> next year
    if (quarterIndex % 3 === 0) {
      year++;
    }
  }

  return schedule;
}