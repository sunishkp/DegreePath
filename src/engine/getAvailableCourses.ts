import { COURSES, Course } from "../data/courses";

export function getAvailableCourses(
  completedCourses: string[]
): Course[] {
  return COURSES.filter((course) => {
    // Prevent already completed courses from showing
    if (completedCourses.includes(course.id)) {
      return false;
    }

    // Check ALL prerequisites are completed - must be completed before the course becomes available
    return course.prerequisites.every((prerequisite) =>
      completedCourses.includes(prerequisite)
    );
  });
}