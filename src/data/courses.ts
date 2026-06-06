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
    units: 6,
    prerequisites: ["ICS46", "ICS51"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "IN4MATX43",
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
    id: "CS161",
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

  /* Algorithms - Specialization*/

  {
    id: "CS162",
    name: "Formal Languages and Autaomata",
    units: 4,
    prerequisites: ["ICS46", "ICS6B", "ICS6D", "MATH2B"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "CS163",
    name: "Graph Algorithms",
    units: 4,
    prerequisites: ["CS161"],
    offered: ["Fall", "Winter", "Spring", "Summer"],
  },

  {
    id: "CS164",
    name: "Computational Geometry",
    units: 4,
    prerequisites: ["CS161"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "CS165",
    name: "Project in Algorithms and Data Structures",
    units: 4,
    prerequisites: ["CS161"],
    offered: ["Fall", "Winter"],
  },

  {
    id: "CS166",
    name: "Quantam Computation and Information",
    units: 4,
    prerequisites: ["CS161", "ICS6N"],
    offered: ["Fall", "Winter"],
  },

  {
    id: "CS167",
    name: "Introduction to Applied Cryptography",
    units: 4,
    prerequisites: ["CS161"],
    offered: ["Fall", "Spring"],
  },

  {
    id: "CS169",
    name: "Introduction to Optimization",
    units: 4,
    prerequisites: ["ICS6N", "STATS67"],
    offered: ["Fall"],
  },

  /* Architecture and Embedded Systems - Specialization*/
  
  {
    id: "CS145",
    name: "Embedded Software",
    units: 4,
    prerequisites: ["ICS46", "ICS51"],
    offered: ["Fall", "Winter"],
  },

  {
    id: "CS147",
    name: "Internet of Things (IoT) Software and Systems",
    units: 4,
    prerequisites: ["ICS33"],
    offered: ["Winter", "Spring"],
  },

  {
    id: "CS151",
    name: "Digital Logic Design",
    units: 4,
    prerequisites: ["ICS33", "ICS51", "ICS6B", "ICS6D"],
    offered: ["Winter"],
  },

  {
    id: "CS152",
    name: "Computer Architecture",
    units: 4,
    prerequisites: ["ICS51"],
    offered: ["Spring"],
  },

  {
    id: "CS154",
    name: "Computer Design Laboratory",
    units: 4,
    prerequisites: ["CS151", "CS152"],
    offered: ["Winter"],
  },

  /* BioInformatics - Specialization*/
  {
    id: "CS184A",
    name: "Artificial Intelligence in Biology and Medicine",
    units: 4,
    prerequisites: ["ICS6N"],
    offered: ["Fall"],
  },

  {
    id: "CS172B",
    name: "Neural Networks and Deep Learning",
    units: 4,
    prerequisites: ["STATS120A", "STATS120B", "CS178"],
    offered: ["Fall"],
  },

  {
    id: "CS172C",
    name: "Artificial Intelligence Frontiers",
    units: 4,
    prerequisites: ["CS171", "CS172B"],
    offered: ["Winter"],
  },

  {
    id: "CS178",
    name: "Machine Learning and Data Mining",
    units: 4,
    prerequisites: ["ICS6B", "ICS6D", "ICS6N", "MATH2B", "STATS67"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "CS184C",
    name: "Computational Systems Biology",
    units: 4,
    prerequisites: ["CS184A"],
    offered: ["Spring"],
  },

  {
    id: "CS189",
    name: "Project in Bioinformatics",
    units: 4,
    prerequisites: ["CS184A"],
    offered: ["Spring"],
  },

  /* Information - Specialization*/
  {
    id: "CS121",
    name: "Information Retrieval",
    units: 4,
    prerequisites: ["ICS45C", "STATS67"],
    offered: ["Fall", "Spring"],
  },

  {
    id: "CS122A",
    name: "Introduction to Data Management",
    units: 4,
    prerequisites: ["ICS33"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "CS122B",
    name: "Project in Databases and Web Applications",
    units: 4,
    prerequisites: ["CS122A", "ICS45J"],
    offered: ["Fall", "Winter"],
  },

  {
    id: "CS122C",
    name: "Principles of Data Management",
    units: 4,
    prerequisites: ["ICS33"],
    offered: ["Spring"],
  },

  {
    id: "CS122D",
    name: "Beyond SQL Data Management",
    units: 4,
    prerequisites: ["ICS46", "ICS51", "CS122A"],
    offered: ["Spring"],
  },

  {
    id: "ICS45J",
    name: "Programming in Java",
    units: 4,
    prerequisites: ["ICS33"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "CS125",
    name: "Next Generation Search Systems",
    units: 4,
    prerequisites: ["ICS45C", "STATS67"],
    offered: ["Spring"],
  },

  {
    id: "CS132",
    name: "Computer Networks",
    units: 4,
    prerequisites: ["STATS67"],
    offered: ["Fall", "Winter", "Spring"],
  },

  {
    id: "CS134",
    name: "Computer and Network Security",
    units: 4,
    prerequisites: ["ICS53", "CS161"],
    offered: ["Winter"],
  },

  {
    id: "CS141",
    name: "Concepts in Programming Languages",
    units: 4,
    prerequisites: ["ICS46", "ICS51"],
    offered: ["Fall"],
  },

  {
    id: "CS142A",
    name: "Compilers and Interpreters",
    units: 4,
    prerequisites: ["ICS46", "ICS51"],
    offered: ["Spring"],
  },

  {
    id: "CS143A",
    name: "Principles of Operating Systems",
    units: 4,
    prerequisites: ["ICS46", "ICS51"],
    offered: ["Winter"],
  },

  








  /* Intelligent Systems - Specialization*/

  /* Networked Systems - Specialization*/

  /* Systems and Software - Specialization*/

  /* Visual Computing - Specialization*/

];