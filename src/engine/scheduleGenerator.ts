// src/engine/scheduleGenerator.ts
export type Quarter = "Fall" | "Winter" | "Spring" | "Summer";

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

  const uniqueCourseMap = new Map<string, Course>();
  for (const course of allCourses) {
    if (course && course.id) {
      uniqueCourseMap.set(course.id, course);
    }
  }
  const sanitizedCourses = Array.from(uniqueCourseMap.values());

  let remainingCourses = allCourses.filter(
    (course) => !completed.has(course.id)
  );

  const standardQuarters: Quarter[] = ["Fall", "Winter", "Spring"];
  const summerQuarters: Quarter[] = ["Fall", "Winter", "Spring", "Summer"];
  
  const quarters = (mode === "SUMMER") ? summerQuarters : standardQuarters;

  let year = startingYear;
  let quarterIndex = quarters.indexOf(startingQuarter);
  
  if (quarterIndex === -1) quarterIndex = 0;

  let internshipApplied = false;

  const strictMaxYears = mode === "LIGHTWEIGHT" ? 8 : maxYears;

  while (remainingCourses.length > 0 && year <= strictMaxYears) {
    const currentQuarter = quarters[quarterIndex];
    const quarterKey = `Year ${year} - ${currentQuarter}`;

    if (mode === "INTERNSHIP" && !internshipApplied && currentQuarter === "Fall") {
      internshipApplied = true;
      schedule[quarterKey] = [];
      
      quarterIndex++;
      if (quarterIndex >= quarters.length) {
        quarterIndex = 0;
        year++;
      }
      continue;
    }

    let currentMaxUnits = maxUnitsPerQuarter;
    if (mode === "FASTEST") {
      currentMaxUnits = 20; 
    } else if (mode === "LIGHTWEIGHT") {
      currentMaxUnits = 12; // Allow up to 3 classes max (12 units)
    }

    let unitsUsed = 0;
    const selectedCourses: Course[] = [];

    const availableCourses = remainingCourses.filter(
      (course) =>
        canTakeCourse(course, completed) &&
        course.offered.includes(currentQuarter)
    );

    if (mode === "FASTEST" || mode === "SUMMER") {
      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : b.units - a.units;
      });
    } else {
      availableCourses.sort((a, b) => {
        const diff = getPriority(b) - getPriority(a);
        return diff !== 0 ? diff : a.units - b.units;
      });
    }

    for (const course of availableCourses) {
      // If adding this class breaks our maximum ceiling limit, look for others
      if (unitsUsed + course.units <= currentMaxUnits) {
        selectedCourses.push(course);
        unitsUsed += course.units;
        
        // Stop matching classes early if we hit a clean 8-unit or 12-unit baseline milestone
        if (mode === "LIGHTWEIGHT" && unitsUsed >= 8) {
          break;
        }
      }
    }

    // FASTEST MINIMUM FLOOR CHECK
    if (mode === "FASTEST" && remainingCourses.length > 0 && unitsUsed < 12) {
      quarterIndex++;
      if (quarterIndex >= quarters.length) {
        quarterIndex = 0;
        year++;
      }
      continue;
    }

    // LIGHTWEIGHT MINIMUM FLOOR CHECK: Prevents single 4-unit quarters by deferring them
    if (mode === "LIGHTWEIGHT" && remainingCourses.length > 0 && unitsUsed < 8) {
      quarterIndex++;
      if (quarterIndex >= quarters.length) {
        quarterIndex = 0;
        year++;
      }
      continue;
    }

    for (const course of selectedCourses) {
      completed.add(course.id);
    }

    remainingCourses = remainingCourses.filter(
      (course) => !completed.has(course.id)
    );

    if (selectedCourses.length > 0) {
      schedule[quarterKey] = selectedCourses;
    }

    quarterIndex++;
    if (quarterIndex >= quarters.length) {
      quarterIndex = 0;
      year++; 
    }
  }

  return schedule;
}