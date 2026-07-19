# DegreePath 🎓

## Overview

DegreePath is an all-in-one academic planning platform designed to simplify the process of navigating a student's journey from enrollment to graduation. The platform helps students create optimized academic plans, track degree progress, estimate tuition costs, and explore different graduation scenarios in one centralized application.

By combining degree auditing, prerequisite-aware scheduling, financial planning, and course recommendations, DegreePath aims to make academic planning more accessible and efficient for students.

---

## Features

### 📚 Degree Audit System

* Tracks progress toward degree completion
* Organizes completed, in-progress, and remaining requirements
* Helps students identify outstanding requirements needed for graduation
* Supports degree-specific planning based on academic goals

### 🗓️ Intelligent Course Planning

* Creates semester-by-semester academic plans
* Accounts for course prerequisites and dependencies
* Prevents invalid schedules by ensuring required courses are completed beforehand
* Helps students explore different paths toward graduation

### 💰 Tuition & Financial Planning

* Estimates tuition costs based on enrollment choices
* Supports different academic scenarios, including:

  * Standard graduation timelines
  * Accelerated graduation paths
  * Summer enrollment options
  * Different course load strategies
* Helps students understand the financial impact of their academic decisions

### 🔄 Scenario Comparison

Students can compare different academic pathways by adjusting variables such as:

* Course load
* Graduation timeline
* Summer enrollment
* Tuition estimates

This allows students to make informed decisions based on both academic and financial goals.

### 🎯 Course Recommendation Engine
- Recommends courses based on a student's degree requirements, completed coursework, and remaining academic goals
- Helps students identify the most relevant courses to take each semester
- Considers prerequisites and degree progress when suggesting available courses
- Allows students to explore different academic pathways and make informed scheduling decisions

---

## Technical Implementation

### Tech Stack

**Frontend**

* Next.js
* React
* TypeScript
* Tailwind CSS

## Architecture

### Course Dependency Modeling

DegreePath models course prerequisites as a dependency graph, where:

* Each course represents a node
* Prerequisites represent directed edges

This structure allows the application to determine valid course sequences and generate feasible academic plans.

Example:

```
ICS 31 → ICS 32 → ICS 33 → ICS 45C
```

The planning engine uses prerequisite relationships to ensure students only schedule courses when requirements have been satisfied.

---

## Planning Engine

The scheduling system considers multiple academic constraints, including:

* Course prerequisites
* Degree requirements
* Semester availability
* Student-selected goals

The system dynamically recalculates schedules when students modify their plans, allowing users to compare different graduation strategies.

---

## Project Goals

DegreePath was created to solve a problem many students face: academic planning requires balancing requirements, prerequisites, course availability, and financial considerations across multiple years.

The goal was to build a tool that transforms a complicated planning process into a more organized and interactive experience.

---

## Future Improvements

Potential future enhancements include:

* User authentication and saved academic plans
* Integration with university course catalogs
* AI-assisted academic planning suggestions
