export const DEGREE_REQUIREMENTS = {
  core: [
    "ICS31",
    "ICS32",
    "ICS33",
    "ICS45C",
    "ICS46",
    "ICS51",
    "ICS53",
    "INFMATX43",
    "ICS6B",
    "ICS6N",
    "ICS6D",
    "STATS67",
    "MATH2A",
    "MATH2B",
    "CS161",
    "ICS139W",
  ],

  /* =========================
     UPPER DIVISION ELECTIVES
     (GLOBAL REQUIREMENT: 11 courses total)
  ========================= */
  upperDivisionElectives: {
    requiredCount: 11,

    allowedCourses: [
      // COMPSCI range rule
      { type: "range", subject: "CS", start: 103, end: 160 },
      { type: "range", subject: "CS", start: 162, end: 189 },

      // IN4MATX courses
      "INFMATX113",
      "INFMATX115",
      "INFMATX117",
      "INFMATX121",
      "INFMATX122",
      "INFMATX124",
      "INFMATX131",
      "INFMATX133",
      "INFMATX134",
    ],

    /* =========================
       PROJECT REQUIREMENT
    ========================= */
    project: {
      requiredCount: 2,

      courses: [
        "CS113",
        "CS114",
        "CS117",
        "CS118",
        "CS122B",
        "CS122C",
        "CS122D",
        "CS125",
        "CS133",
        "CS142B",
        "CS143B",
        "CS145",
        "CS147",
        "CS154",
        "CS165",
        "CS175",
        "CS180A",
        "CS180B",
        "CS189",
        "INFMATX117",
        "INFMATX134",
      ],
    },
  },

  /* =========================
     SPECIALIZATIONS
     (independent requirement track)
  ========================= */
  specializations: {
    Algorithms: {
      mandatory: [],
      electives: [
        "CS162",
        "CS163",
        "CS164",
        "CS165",
        "CS166",
        "CS167",
        "CS169",
      ],
      electiveCount: 4,
    },

    EmbeddedSystems: {
      mandatory: [],
      electives: [
        "CS145",
        "CS147",
        "CS151",
        "CS152",
        "CS154",
      ],
      electiveCount: 4,
    },

    Bioinformatics: {
      mandatory: ["CS189"],
      electives: [
        "CS172B",
        "CS172C",
        "CS178",
        "CS184C",
      ],
      electiveCount: 2,
    },

    Information: {
      mandatory: [
        "CS121",
        "CS122A",
        "CS178",
      ],
      electives: [
        "CS122B",
        "CS122C",
        "CS122D",
        "CS125",
        "CS132",
        "CS134",
        "CS141",
        "CS142A",
        "CS143A",
        "CS163",
        "CS165",
        "CS167",
        "CS179",
      ],
      electiveCount: 4,
    },

    IntelligentSystems: {
      mandatory: [
        "CS171",
        "CS175",
        "CS178",
      ],
      electives: [
        "CS116",
        "CS121",
        "CS125",
        "CS162",
        "CS163",
        "CS164",
        "CS169",
        "CS177",
        "CS179",
      ],
      electiveCount: 3,
    },

    NetworkedSystems: {
      mandatory: [
        "CS132",
        "CS133",
        "CS134",
        "CS143A",
      ],
      electives: [],
      electiveCount: 0,
    },

    SystemsSoftware: {
      mandatory: [],
      electives: [
        "CS131",
        "CS141",
        "CS142A",
        "CS142B",
        "CS143A",
        "CS143B",
      ],
      electiveCount: 3,
    },

    VisualComputing: {
      mandatory: [],
      electives: [
        "CS111",
        "CS112",
        "CS114",
        "CS116",
        "CS117",
        "CS118",
      ],
      electiveCount: 4,
    },
  },
}