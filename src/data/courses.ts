export interface Course {
  id: string;
  name: string;
  units: number;
  prerequisites: string[];
  offered: ("Fall" | "Winter" | "Spring" | "Summer")[];
}

export const COURSES: Course[] = [
  {
    id: "ICS31",
    name: "Introduction to Programming",
    units: 4,
    prerequisites: [],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS32",
    name: "Programming with Software Libraries",
    units: 4,
    prerequisites: ["ICS31"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS33",
    name: "Intermediate Programming",
    units: 4,
    prerequisites: ["ICS32"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS45C",
    name: "Programming in C/C++",
    units: 4,
    prerequisites: ["ICS33"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS46",
    name: "Data Structure Implementation and Analysis",
    units: 4,
    prerequisites: ["ICS33", "ICS45C"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "ICS51",
    name: "Introductory Computer Organization",
    units: 4,
    prerequisites: ["ICS33", "ICS6B"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS53",
    name: "Principles in System Design",
    units: 4,
    prerequisites: ["ICS46", "ICS51"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "In4Matx 43",
    name: "Introduction to Software Engineering",
    units: 4,
    prerequisites: ["ICS32"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS6B",
    name: "Boolean Algebra & Logic",
    units: 4,
    prerequisites: [],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS6D",
    name: "Discrete Mathematics for Computer Science",
    units: 4,
    prerequisites: ["ICS6B"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "ICS6N",
    name: "Computational Linear Algebra",
    units: 4,
    prerequisites: ["ICS31"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "MATH2A",
    name: "Single Variable Calculus I",
    units: 4,
    prerequisites: [],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "MATH2B",
    name: "Single Variable Calculus II",
    units: 4,
    prerequisites: ["MATH2A"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "STATS67",
    name: "Introduction to Probability and Statistics",
    units: 4,
    prerequisites: ["MATH2B"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "COMPSCI 161",
    name: "Design and Analysis of Algorithms",
    units: 4,
    prerequisites: ["ICS46", "ICS6D", "ICS6B", "MATH2B"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "ICS139W",
    name: "Critical Writing on Information Technology",
    units: 4,
    prerequisites: ["ICS33"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

];