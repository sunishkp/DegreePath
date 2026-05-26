export type Quarter =
  | "Fall"
  | "Winter"
  | "Spring"
  | "Summer";

export type OptimizationMode =
  | "FASTEST"
  | "BALANCED"
  | "LIGHTWEIGHT";

export interface Course {
  id: string;
  name: string;
  units: number;
  prerequisites: string[];
  offered: Quarter[];
}