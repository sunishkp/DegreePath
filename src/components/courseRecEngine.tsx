"use client";

import { useState, useMemo } from "react";
import { COURSES, Course } from "../data/courses";
import { DEGREE_REQUIREMENTS } from "../data/degreeRequirements";


export interface DependencyMetrics {
  courseId: string;
  directUnlocks: string[];
  totalDownstreamCount: number; // Size of downstream Dependency Tree (BFS traversal)
  criticalPathWeight: number;   // Max depth of the longest dependency chain
  isBottleneck: boolean;        // True if unlocks > 4 courses or has high weight
}

export interface RecommendationMatch {
  course: Course;
  matchScore: number;           // Calculated out of 100 via state-weighted scoring matrix
  metrics: DependencyMetrics;
  workloadEstimation: "Balanced" | "Accelerated" | "Intense";
  reasons: string[];
}

interface CourseRecommendationEngineProps {
  completedCourses: string[];
  currentSpecialization: string;
  currentQuarter: "Fall" | "Winter" | "Spring" | "Summer";
  remainingUnitsNeeded: number;
}

// EXPERT INTENT DICTIONARY FOR THE ISOLATED ELECTIVE EXPLORER
const CAREER_TRACK_MATRICES = [
  { id: "swe", label: "Software Systems & Applications", tokens: ["software", "design", "architecture", "web", "frontend", "backend", "application", "systems", "programming"] },
  { id: "ai", label: "Artificial Intelligence & Data Engineering", tokens: ["data", "machine", "intelligence", "learning", "stats", "mining", "database", "analytics"] },
  { id: "net", label: "Cloud Infrastructure & Cybersecurity", tokens: ["network", "distributed", "cloud", "protocol", "telecom", "security", "crypto", "privacy"] },
  { id: "hci", label: "Human-Computer Interaction & UI/UX", tokens: ["user", "ui", "ux", "human", "interaction", "design", "graphics", "interface"] },
  { id: "dsa", label: "Data Structures, Algorithms & Theory", tokens: ["algorithm", "structure", "complexity", "graph", "tree", "optimization", "automata", "theory", "interview"] }
];

export default function CourseRecommendationEngine({
  completedCourses = [],
  currentSpecialization = "ALL",
  currentQuarter = "Fall",
  remainingUnitsNeeded = 44,
}: CourseRecommendationEngineProps) {
  
  // State for the Side-by-Side Comparison Matrix (Max 2 courses)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recommendations" | "comparison">("recommendations");

  // NEW FEATURE STATES (Kept entirely isolated from DAG operations)
  const [selectedTrackId, setSelectedTrackId] = useState<string>("dsa");
  const [customInterestQuery, setCustomInterestQuery] = useState<string>("");

  /* ==========================================================================
     ALGORITHMIC ENGINE: Directed Acyclic Graph (DAG) Prerequisite Traversal
     Uses Breadth-First Search (BFS) to compute holistic dependency analytics.
     ========================================================================== */
  const dependencyGraph = useMemo(() => {
    const graph: Record<string, DependencyMetrics> = {};

    // Helper function: Find everything that requires courseId as an immediate prerequisite
    const getDirectUnlocks = (id: string): string[] => {
      return COURSES.filter((c) => c.prerequisites?.includes(id)).map((c) => c.id);
    };

    // Helper function: Compute recursive downstream reachability via BFS
    const computeDownstreamMetrics = (startId: string) => {
      const visited = new Set<string>();
      const queue: { id: string; depth: number }[] = [{ id: startId, depth: 0 }];
      let maxDepth = 0;

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.id !== startId) {
          visited.add(current.id);
        }
        
        maxDepth = Math.max(maxDepth, current.depth);
        const nextNodes = getDirectUnlocks(current.id);
        
        for (const nextId of nextNodes) {
          if (!visited.has(nextId) && !queue.some(q => q.id === nextId)) {
            queue.push({ id: nextId, depth: current.depth + 1 });
          }
        }
      }

      return {
        totalCount: visited.size,
        maxDepth: maxDepth
      };
    };

    // Populate graph metrics for all available courses
    COURSES.forEach((course) => {
      const direct = getDirectUnlocks(course.id);
      const { totalCount, maxDepth } = computeDownstreamMetrics(course.id);

      graph[course.id] = {
        courseId: course.id,
        directUnlocks: direct,
        totalDownstreamCount: totalCount,
        criticalPathWeight: maxDepth,
        isBottleneck: totalCount >= 4 || maxDepth >= 2,
      };
    });

    return graph;
  }, []);

  /* ==========================================================================
     SCORING MATRIX ENGINE: Personalized Optimization & Recommendation Metrics
     Weighted heuristics approach mapping curriculum requirements to current state.
     ========================================================================== */
  const recommendations = useMemo(() => {
    const pool: RecommendationMatch[] = [];

    COURSES.forEach((course) => {
      // Rule 0: Skip if already finished
      if (completedCourses.includes(course.id)) return;

      let score = 0;
      const reasons: string[] = [];

      // Prerequisite validation state helper
      const missingPrereqs = (course.prerequisites || []).filter(p => !completedCourses.includes(p));
      const prereqsMet = missingPrereqs.length === 0;

      // Heuristic 1: Readiness Status (Crucial constraint checking)
      if (prereqsMet) {
        score += 35;
        reasons.push("Ready to take: All prerequisites successfully completed.");
      } else {
        score -= 20; // Deprioritize if locked
      }

      // Heuristic 2: Active Timeline Alignment (Seasonal availability checking)
      if (course.offered?.includes(currentQuarter)) {
        score += 25;
        reasons.push(`Perfect structural fit: Offered this upcoming ${currentQuarter} term.`);
      }

      // Heuristic 3: Curriculum Requirement Categorization (ADAPTED FOR DYNAMIC RANGES & PROJS)
      const isCore = DEGREE_REQUIREMENTS.core?.includes(course.id);
      
      const upperDivElectivesPool = DEGREE_REQUIREMENTS.upperDivisionElectives?.allowedCourses || [];
      const projectPool = DEGREE_REQUIREMENTS.upperDivisionElectives?.project?.courses || [];

      // Safely evaluate string declarations or object ranges
      const isUpperDivElective = upperDivElectivesPool.some((rule: any) => {
        if (typeof rule === "string") {
          return rule === course.id;
        }
        if (rule?.type === "range" && course.id.startsWith(rule.subject)) {
          const courseNum = parseInt(course.id.replace(/^\D+/g, ""), 10);
          return !isNaN(courseNum) && courseNum >= rule.start && courseNum <= rule.end;
        }
        return false;
      });

      const isProjectCourse = projectPool.includes(course.id);

      if (isCore) {
        score += 30;
        reasons.push("High Priority: Fulfills a mandatory foundational core major milestone.");
      } else if (isProjectCourse) {
        score += 25;
        reasons.push("Project Requirement: Satisfies an upper-division capstone milestone.");
      } else if (isUpperDivElective) {
        score += 15;
        reasons.push("Upper Division Elective: Counts directly toward your global elective requirements.");
      }

      // Heuristic 4: Graph Dependency Impact Boosters
      const graphMetrics = dependencyGraph[course.id];
      if (graphMetrics?.isBottleneck && prereqsMet) {
        score += 10;
        reasons.push(`High Impact Path: Unlocks a network of ${graphMetrics.totalDownstreamCount} subsequent courses.`);
      }

      // Classify relative workload intensity based on weight indices
      let workload: "Balanced" | "Accelerated" | "Intense" = "Balanced";
      if (isCore && graphMetrics?.criticalPathWeight >= 2) {
        workload = "Intense";
      } else if (isCore || isProjectCourse || graphMetrics?.totalDownstreamCount > 0) {
        workload = "Accelerated";
      }

      pool.push({
        course,
        matchScore: Math.min(100, Math.max(0, score)),
        metrics: graphMetrics || { courseId: course.id, directUnlocks: [], totalDownstreamCount: 0, criticalPathWeight: 0, isBottleneck: false },
        workloadEstimation: workload,
        reasons: reasons.slice(0, 3) // Cap at top 3 explicit explanations
      });
    });

    // Sort descending by highest calculated matching accuracy
    return pool.sort((a, b) => b.matchScore - a.matchScore);
  }, [completedCourses, currentQuarter, dependencyGraph]);

  // Combined search filtering handler
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => 
      rec.course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recommendations, searchQuery]);

  /* ==========================================================================
     ISOLATED ALGO FEATURE: Independent Intent-Based Keyword Conceptual Classifier
     ========================================================================== */
  const standaloneElectiveMatches = useMemo(() => {
    const activeTrack = CAREER_TRACK_MATRICES.find(t => t.id === selectedTrackId);
    let targetingTokens = activeTrack ? [...activeTrack.tokens] : [];

    // Map user raw string entries into prioritized pattern-matching lists
    if (customInterestQuery.trim().length > 0) {
      targetingTokens = customInterestQuery
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(t => t.length > 2);
    }

    return COURSES.filter((course) => {
      if (completedCourses.includes(course.id)) return false;
      
      const titleLower = course.name.toLowerCase();
      const idLower = course.id.toLowerCase();
      
      return targetingTokens.some(tok => titleLower.includes(tok) || idLower.includes(tok));
    }).map(course => {
      const titleLower = course.name.toLowerCase();
      const hits = targetingTokens.filter(tok => titleLower.includes(tok)).length;
      
      return {
        course,
        affinityLevel: hits >= 2 ? "High Core Match" : "Relevant Context",
        metrics: dependencyGraph[course.id]
      };
    }).sort((a, b) => (b.metrics?.totalDownstreamCount || 0) - (a.metrics?.totalDownstreamCount || 0));
  }, [selectedTrackId, customInterestQuery, completedCourses, dependencyGraph]);

  // Selection matrix tracker
  const toggleComparisonSelection = (courseId: string) => {
    if (selectedForCompare.includes(courseId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== courseId));
    } else {
      if (selectedForCompare.length >= 2) {
        // Enforce rigid dual limit window bounds safely
        setSelectedForCompare([selectedForCompare[1], courseId]);
      } else {
        setSelectedForCompare(prev => [...prev, courseId]);
      }
    }
  };

  return (
    <div className="space-y-8 w-full">
      
      {/* SECTION BLOCK A: EXISTING REQUISITE GRAPH AND OPTIMIZATION SUITE */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-sm font-sans">
        
        {/* HEADER BAR BANNERS */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                Dependency Graph Analytics & Smart Fit Engine
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Contextual Scoring & Recursive Prerequisite Impact Traversal
              </p>
            </div>
            
            {/* TAB SELECTION ACCENTS */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-center">
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "recommendations"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Smart Recommendations
              </button>
              <button
                onClick={() => setActiveTab("comparison")}
                className={`px-4 py-2 preparedness-accent rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "comparison"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Matrix Comparison
                {selectedForCompare.length > 0 && (
                  <span className="bg-indigo-600 text-white rounded-full text-[10px] px-1.5 py-0.5">
                    {selectedForCompare.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* VIEW PANEL 1: SMART RECOMMENDATIONS VIEW */}
        {activeTab === "recommendations" && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Query by course ID code or name catalog parameters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 shrink-0">
                <span>Term: <strong className="text-indigo-500">{currentQuarter}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Track: <strong className="text-violet-500">{currentSpecialization}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
              {filteredRecommendations.map((rec) => {
                const isSelected = selectedForCompare.includes(rec.course.id);
                return (
                  <div 
                    key={rec.course.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-sm text-slate-800 dark:text-slate-100">
                              {rec.course.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              rec.workloadEstimation === "Intense" 
                                ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600"
                                : rec.workloadEstimation === "Accelerated"
                                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600"
                                : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                            }`}>
                              {rec.workloadEstimation} Load
                            </span>
                            {rec.metrics.isBottleneck && (
                              <span className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                🔥 Critical Path Item
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-slate-600 dark:text-slate-300 text-xs mt-1 line-clamp-1">
                            {rec.course.name}
                          </h4>
                        </div>

                        {/* CIRCULAR MATCH SCORE BADGE */}
                        <div className="flex flex-col items-center shrink-0 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">
                            {rec.matchScore}%
                          </span>
                          <span className="text-[9px] font-medium uppercase text-slate-400 mt-0.5 tracking-wider">
                            Fit Score
                          </span>
                        </div>
                      </div>

                      {/* DOWNSTREAM INSIGHT BULLETS */}
                      <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50/50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Direct Unlocks</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                            {rec.metrics.directUnlocks.length} courses
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Cascading Dependencies</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                            {rec.metrics.totalDownstreamCount} unlocked total
                          </span>
                        </div>
                      </div>

                      {/* BULLET STRATEGIC RATIONALE LOGGING MAPS */}
                      <ul className="mt-3 space-y-1.5 border-t border-slate-50 dark:border-slate-800 pt-2.5">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                            <span className="text-indigo-500 shrink-0 mt-0.5">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        Prereqs: <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">
                          {rec.course.prerequisites?.length ? rec.course.prerequisites.join(", ") : "None"}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleComparisonSelection(rec.course.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {isSelected ? "✓ Compare Target" : "+ Add to Compare"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW PANEL 2: SIDE-BY-SIDE MATRIX RECONCILIATION */}
        {activeTab === "comparison" && (
          <div className="p-6">
            {selectedForCompare.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-3xl block mb-2">📊</span>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No courses selected for analytical cross-comparison</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Navigate back to the Recommendations panel and select up to 2 distinct targets to chart downstream dependencies and structural offering metrics.
                </p>
                <button 
                  onClick={() => setActiveTab("recommendations")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-xl"
                >
                  Browse Recommendation Pool
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                      <th className="p-4 w-1/4">Metric Dimension</th>
                      {selectedForCompare.map(id => (
                        <th key={id} className="p-4 w-3/8 font-mono font-black text-sm text-slate-800 dark:text-slate-200">
                          {id}
                        </th>
                      ))}
                      {selectedForCompare.length === 1 && <th className="p-4 w-3/8 text-slate-300 italic font-normal">Awaiting second comparison asset selection...</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                    
                    {/* ROW 1: CATALOG NAME */}
                    <tr>
                      <td className="p-4 font-semibold bg-slate-50/40 dark:bg-slate-900/40 text-slate-400">Course Name</td>
                      {selectedForCompare.map(id => {
                        const match = COURSES.find(c => c.id === id);
                        return <td key={id} className="p-4 font-medium">{match?.name || "N/A"}</td>;
                      })}
                      {selectedForCompare.length === 1 && <td className="p-4"></td>}
                    </tr>

                    {/* ROW 2: STRATEGIC FIT MATCH INDEX */}
                    <tr>
                      <td className="p-4 font-semibold bg-slate-50/40 dark:bg-slate-900/40 text-slate-400">Algorithmic Fit Index</td>
                      {selectedForCompare.map(id => {
                        const match = recommendations.find(r => r.course.id === id);
                        return (
                          <td key={id} className="p-4">
                            <span className="font-mono font-bold text-base text-indigo-600 dark:text-indigo-400">{match?.matchScore || 0}% Match</span>
                          </td>
                        );
                      })}
                      {selectedForCompare.length === 1 && <td className="p-4"></td>}
                    </tr>

                    {/* ROW 3: RECURSIVE PATH IMPACT TRAVERSAL REACH */}
                    <tr>
                      <td className="p-4 font-semibold bg-slate-50/40 dark:bg-slate-900/40 text-slate-400">Prerequisite Tree Footprint</td>
                      {selectedForCompare.map(id => {
                        const metrics = dependencyGraph[id];
                        return (
                          <td key={id} className="p-4 space-y-1">
                            <div>Directly unlocks: <strong className="font-mono text-slate-800 dark:text-slate-200">{metrics?.directUnlocks.length} courses</strong></div>
                            <div className="text-[11px] text-slate-400">
                              Total downstream dependency cascade radius: <strong className="font-mono font-bold text-purple-500">{metrics?.totalDownstreamCount} classes</strong>
                            </div>
                          </td>
                        );
                      })}
                      {selectedForCompare.length === 1 && <td className="p-4"></td>}
                    </tr>

                    {/* ROW 4: QUARTERS REMAINING OFFERINGS */}
                    <tr>
                      <td className="p-4 font-semibold bg-slate-50/40 dark:bg-slate-900/40 text-slate-400">Availability Terms</td>
                      {selectedForCompare.map(id => {
                        const match = COURSES.find(c => c.id === id);
                        return (
                          <td key={id} className="p-4 flex gap-1 flex-wrap">
                            {match?.offered?.map(q => (
                              <span key={q} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium text-[10px]">
                                {q}
                              </span>
                            ))}
                          </td>
                        );
                      })}
                      {selectedForCompare.length === 1 && <td className="p-4"></td>}
                    </tr>

                    {/* ROW 5: DETAILED PREREQ CHAINS */}
                    <tr>
                      <td className="p-4 font-semibold bg-slate-50/40 dark:bg-slate-900/40 text-slate-400">Immediate Prerequisites</td>
                      {selectedForCompare.map(id => {
                        const match = COURSES.find(c => c.id === id);
                        const missing = (match?.prerequisites || []).filter(p => !completedCourses.includes(p));
                        return (
                          <td key={id} className="p-4 space-y-1">
                            <div>
                              {match?.prerequisites?.length 
                                ? match.prerequisites.map(p => (
                                    <span key={p} className={`inline-block font-mono text-[10px] px-1.5 py-0.5 rounded mr-1 ${
                                      completedCourses.includes(p) ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    }`}>
                                      {p}
                                    </span>
                                  ))
                                : "None required."
                              }
                            </div>
                            {missing.length > 0 && (
                              <p className="text-[10px] text-rose-500 font-medium">⚠️ Registration locked until missing constraints are resolved.</p>
                            )}
                          </td>
                        );
                      })}
                      {selectedForCompare.length === 1 && <td className="p-4"></td>}
                    </tr>

                    {/* ROW 6: STRUCTURAL CONFLICT ASSESSMENT LOOKUPS */}
                    {selectedForCompare.length === 2 && (
                      <tr className="bg-amber-50/20 dark:bg-amber-950/10">
                        <td className="p-4 font-semibold text-amber-700 dark:text-amber-400">Conflict Matrix Verdict</td>
                        <td colSpan={2} className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {(() => {
                            const courseA = COURSES.find(c => c.id === selectedForCompare[0]);
                            const courseB = COURSES.find(c => c.id === selectedForCompare[1]);
                            
                            const termsA = courseA?.offered || [];
                            const termsB = courseB?.offered || [];
                            const overlappingTerms = termsA.filter(t => termsB.includes(t));

                            const metricsA = dependencyGraph[selectedForCompare[0]];
                            const metricsB = dependencyGraph[selectedForCompare[1]];

                            if (overlappingTerms.length === 1 && overlappingTerms.includes(currentQuarter)) {
                              return `⚠️ Resource Collision: Both ${selectedForCompare[0]} and ${selectedForCompare[1]} are strictly restricted to ${overlappingTerms[0]}. Scheduling both in the same term could over-accelerate study load. Recommendation: Sequence ${metricsA.totalDownstreamCount >= metricsB.totalDownstreamCount ? selectedForCompare[0] : selectedForCompare[1]} first.`;
                            }
                            
                            if (metricsA.isBottleneck && metricsB.isBottleneck) {
                              return "⚡ High-Impedance Term Detection: Both selections constitute structural bottleneck nodes. Attempting concurrent enrollment is highly viable to maximize deep track velocity quickly.";
                            }

                            return "✓ Co-enrollment Optimization Clean: No structural offering bottlenecks or overlapping constraints flagged. Courses can be scheduled concurrently or sequence shifted seamlessly.";
                          })()}
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-right">
                  <button
                    onClick={() => setSelectedForCompare([])}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Clear Comparison Targets
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==========================================================================
         SECTION BLOCK B: INDEPENDENT INTENT-DRIVEN CONCEPT MATCHER
         ========================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6 text-sm font-sans">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Decide What Course to Take to Match Your Interests
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover tailored elective course variations instantly by cross-referencing semantic skill tags or custom engineering concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* TRACK PICKER CONTROLS PANEL */}
          <div className="space-y-4 lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Industry Focus Clusters
              </label>
              <div className="space-y-2">
                {CAREER_TRACK_MATRICES.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => { setSelectedTrackId(track.id); setCustomInterestQuery(""); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col ${
                      selectedTrackId === track.id && customInterestQuery.length === 0
                        ? "bg-indigo-50/70 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400"
                        : "bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="font-bold text-xs">{track.label}</span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">Tokens: {track.tokens.join(", ")}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Custom Keyword Statement
                </label>
                {customInterestQuery && (
                  <button onClick={() => setCustomInterestQuery("")} className="text-[10px] text-indigo-500 hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <textarea
                placeholder="Ex: I want to build distributed web systems or study cryptography primitives..."
                value={customInterestQuery}
                onChange={(e) => setCustomInterestQuery(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* STREAMLINED DISCOVERY OUTPUT */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target Parameters: <strong className="text-slate-700 dark:text-slate-300">{customInterestQuery ? "Custom Text Input Parsed" : CAREER_TRACK_MATRICES.find(t => t.id === selectedTrackId)?.label}</strong></span>
              <span>Pool Size: <strong>{standaloneElectiveMatches.length} matching courses</strong></span>
            </div>

            <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
              {standaloneElectiveMatches.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50">
                  No matching catalog components located. Refine criteria to basic string patterns (e.g., "web", "design", "data").
                </div>
              ) : (
                standaloneElectiveMatches.map(({ course, affinityLevel, metrics }) => (
                  <div key={course.id} className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl transition-all hover:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                          {course.id}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                          ✨ {affinityLevel}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs">{course.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Seasonal Terms: {course.offered?.join(", ") || "Variable"} | Unit Value: {course.units || 4} Credits
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Downstream Scope</span>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                          {metrics?.totalDownstreamCount || 0} courses unlocked
                        </span>
                      </div>
                      <button 
                        onClick={() => toggleComparisonSelection(course.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm"
                      >
                        Stage for Matrix
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}