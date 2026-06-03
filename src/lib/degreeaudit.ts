import { DEGREE_REQUIREMENTS } from "../data/degreeRequirements";

/* =========================
   Helper: normalize course
========================= */
function normalize(course: string) {
  return course.replace(/\s+/g, "").toUpperCase();
}

/* =========================
   Helper: check CS range
========================= */
function inRange(course: string, start: number, end: number) {
  const match = course.match(/^CS(\d+)$/);
  if (!match) return false;

  const num = parseInt(match[1]);
  return num >= start && num <= end;
}

/* =========================
   Check if course is valid upper-div
========================= */
function isUpperDiv(course: string) {
  const c = normalize(course);

  const allowed = DEGREE_REQUIREMENTS.upperDivisionElectives.allowedCourses;

  return allowed.some((rule: any) => {
    if (typeof rule === "string") {
      return normalize(rule) === c;
    }

    if (rule.type === "range") {
      return inRange(c, rule.start, rule.end);
    }

    return false;
  });
}

/* =========================
   CORE CHECK
========================= */
function checkCore(completed: string[]) {
  const core = DEGREE_REQUIREMENTS.core.map(normalize);

  const done = completed.filter(c => core.includes(c));

  return {
    completed: done,
    remaining: core.filter(c => !done.includes(c)),
    total: core.length,
    completedCount: done.length,
    percent: Math.round((done.length / core.length) * 100),
    complete: done.length === core.length,
  };
}

/* =========================
   UPPER DIV CHECK
========================= */
function checkUpperDiv(completed: string[]) {
  const valid = completed.filter(isUpperDiv);

  const unique = Array.from(new Set(valid));

  const required = DEGREE_REQUIREMENTS.upperDivisionElectives.requiredCount;

  return {
    completed: unique,
    completedCount: unique.length,
    remaining: Math.max(0, required - unique.length),
    required,
    complete: unique.length >= required,
  };
}

/* =========================
   PROJECT CHECK (OVERLAPS allowed)
========================= */
function checkProjects(completed: string[]) {
  const project = DEGREE_REQUIREMENTS.upperDivisionElectives.project;

  const done = completed.filter(c =>
    project.courses.map(normalize).includes(normalize(c))
  );

  const unique = Array.from(new Set(done));

  return {
    completed: unique,
    completedCount: unique.length,
    required: project.requiredCount,
    remaining: Math.max(0, project.requiredCount - unique.length),
    complete: unique.length >= project.requiredCount,
  };
}

/* =========================
   SPECIALIZATION CHECK
========================= */
function checkSpecialization(completed: string[], specName: string) {
  const spec = DEGREE_REQUIREMENTS.specializations[specName as keyof typeof DEGREE_REQUIREMENTS.specializations];

  if (!spec) throw new Error("Invalid specialization");

  const done = completed.filter(c =>
    spec.electives.map(normalize).includes(normalize(c)) ||
    spec.mandatory.map(normalize).includes(normalize(c))
  );

  const unique = Array.from(new Set(done));

  const required = spec.electiveCount;

  return {
    completed: unique,
    completedCount: unique.length,
    required,
    remaining: Math.max(0, required - unique.length),
    complete: unique.length >= required,
  };
}

/* =========================
   MAIN AUDIT FUNCTION
========================= */
export function runDegreeAudit(
  completedCourses: string[],
  specialization?: string
) {
  const completed = completedCourses.map(normalize);

  return {
    core: checkCore(completed),
    upperDiv: checkUpperDiv(completed),
    projects: checkProjects(completed),
    specialization: specialization
      ? checkSpecialization(completed, specialization)
      : null,
  };
}