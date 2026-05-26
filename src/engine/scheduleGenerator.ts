// src/engine/scheduleGenerator.ts

export type Quarter =
  | "Fall"
  | "Winter"
  | "Spring"
  | "Summer";

export type OptimizationMode =
  | "FASTEST"
  | "BALANCED"
  | "LIGHTWEIGHT"
  | "SUMMER"
  | "INTERNSHIP";

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

function canTakeCourse(
  course: Course,
  completedCourses: Set<string>
): boolean {
  return course.prerequisites.every((prereq) =>
    completedCourses.has(prereq)
  );
}

function getPriority(course: Course): number {
  let score = 0;

  score += course.prerequisites.length * 3;

  if (course.id.startsWith("ICS")) {
    score += 5;
  }

  return score;
}

export function generateSchedule(
  allCourses: Course[],
  completedCourseIds: string[],
  maxUnitsPerQuarter: number,
  startingYear = 1,
  startingQuarter: Quarter = "Fall",
  mode: OptimizationMode = "BALANCED",
  maxYears: number = 4
): Schedule {

  const schedule: Schedule = {};

  const completed = new Set<string>(completedCourseIds);

  let remainingCourses = allCourses.filter(
    (course) => !completed.has(course.id)
  );

  let quarters: Quarter[] = [
    "Fall",
    "Winter",
    "Spring",
  ];

  if (mode === "SUMMER") {
    quarters = ["Fall", "Winter", "Spring", "Summer"];
  }

  let year = startingYear;

  let quarterIndex = quarters.indexOf(startingQuarter);

  let internshipApplied = false;

  while (
    remainingCourses.length > 0 &&
    year <= maxYears
  ) {

    const currentQuarter =
      quarters[quarterIndex % quarters.length];

    const quarterKey = `Year ${year} - ${currentQuarter}`;

    if (
      mode === "INTERNSHIP" &&
      !internshipApplied &&
      currentQuarter === "Fall"
    ) {
      internshipApplied = true;

      schedule[quarterKey] = [];

      quarterIndex++;

      if (quarterIndex % quarters.length === 0) {
        year++;
      }

      continue;
    }

    let unitsUsed = 0;
    const selectedCourses: Course[] = [];

    const availableCourses = remainingCourses.filter(
      (course) =>
        canTakeCourse(course, completed) &&
        course.offered.includes(currentQuarter)
    );

    if (mode === "FASTEST") {
      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : b.units - a.units;
      });
    } else if (mode === "BALANCED") {
      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : a.units - b.units;
      });
    } else if (mode === "LIGHTWEIGHT") {
      maxUnitsPerQuarter = 8;

      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : a.units - b.units;
      });
    } else if (mode === "SUMMER") {
      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : b.units - a.units;
      });
    } else if (mode === "INTERNSHIP") {
      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : a.units - b.units;
      });
    }

    for (const course of availableCourses) {
      if (unitsUsed + course.units <= maxUnitsPerQuarter) {
        selectedCourses.push(course);
        unitsUsed += course.units;
      }
    }

    for (const course of selectedCourses) {
      completed.add(course.id);
    }

    remainingCourses = remainingCourses.filter(
      (course) => !completed.has(course.id)
    );

    schedule[quarterKey] = selectedCourses;

    quarterIndex++;

    if (quarterIndex % quarters.length === 0) {
      year++;
    }
  }

  return schedule;
}