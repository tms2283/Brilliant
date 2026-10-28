import circuits01 from "./lessons/circuits-01.json";
import circuits02 from "./lessons/circuits-02.json";
import circuits03 from "./lessons/circuits-03.json";
import circuits04 from "./lessons/circuits-04.json";
import balance01 from "./lessons/balance-01.json";
import balance02 from "./lessons/balance-02.json";
import balance03 from "./lessons/balance-03.json";
import mechanics01 from "./lessons/mechanics-01.json";
import mechanics02 from "./lessons/mechanics-02.json";
import mechanics03 from "./lessons/mechanics-03.json";
import optics01 from "./lessons/optics-01.json";
import optics02 from "./lessons/optics-02.json";
import optics03 from "./lessons/optics-03.json";
import chemistry01 from "./lessons/chemistry-01.json";
import chemistry02 from "./lessons/chemistry-02.json";
import chemistry03 from "./lessons/chemistry-03.json";
import logic01 from "./lessons/logic-01.json";
import logic02 from "./lessons/logic-02.json";
import type { Concept, ConceptEdge } from "../schemas/concept.js";
import { validateLesson, type LessonDoc } from "../schemas/lesson.js";
import type { Domain } from "../schemas/common.js";

export interface LevelSeed {
  id: string;
  title: string;
  ordinal: number;
}

export interface CourseSeed {
  id: string;
  version: string;
  title: string;
  domain: Domain;
  description: string;
  status: "active" | "draft" | "archived";
  levels: LevelSeed[];
}

export const COURSES: CourseSeed[] = [
  {
    id: "circuits",
    version: "1.0.0",
    title: "Circuits",
    domain: "circuits",
    description: "Voltage, current, and resistance — reasoned from the physical picture, not memorised formulas.",
    status: "active",
    levels: [
      { id: "circuits-level-1", title: "DC circuits", ordinal: 0 },
      { id: "circuits-level-2", title: "Networks", ordinal: 1 },
    ],
  },
  {
    id: "balance",
    version: "1.0.0",
    title: "Balance",
    domain: "balance",
    description: "Keep both sides equal while the symbols move. Algebra as a physical act.",
    status: "active",
    levels: [
      { id: "balance-level-1", title: "One unknown", ordinal: 0 },
      { id: "balance-level-2", title: "Two-step equations", ordinal: 1 },
    ],
  },
  {
    id: "mechanics",
    version: "1.0.0",
    title: "Mechanics",
    domain: "mechanics",
    description: "Balance forces and torques by reasoning about leverage, not by memorising formulas.",
    status: "active",
    levels: [{ id: "mechanics-level-1", title: "Torque and machines", ordinal: 0 }],
  },
  {
    id: "optics",
    version: "1.0.0",
    title: "Optics",
    domain: "optics",
    description: "Bending light and forming images — wave speed changes meet geometric ray tracing.",
    status: "active",
    levels: [{ id: "optics-level-1", title: "Refraction and lenses", ordinal: 0 }],
  },
  {
    id: "chemistry",
    version: "1.0.0",
    title: "Chemical Kinetics",
    domain: "chemistry",
    description: "Reaction rates, collision dynamics, and exponential half-life decay.",
    status: "active",
    levels: [{ id: "chemistry-level-1", title: "Rates and orders", ordinal: 0 }],
  },
  {
    id: "logic",
    version: "1.0.0",
    title: "Logic & Digital Gates",
    domain: "logic",
    description: "Truth tables, Boolean algebra, and digital switches — the foundations of computation.",
    status: "active",
    levels: [{ id: "logic-level-1", title: "Boolean operators", ordinal: 0 }],
  },
];

export const CONCEPTS: Concept[] = [
  {
    id: "circuits.ohms-law",
    domain: "circuits",
    title: "Ohm's law",
    knowledgePoints: [
      "Current is charge flow per second",
      "Voltage is energy per charge",
      "V = I R for a resistor",
      "Rearranging V = I R to solve for any one quantity",
    ],
    generatorIds: ["circuits.ohms-law"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "circuits.series",
    domain: "circuits",
    title: "Series circuits",
    knowledgePoints: [
      "One path for current",
      "Resistances add",
      "Current is the same at every point",
      "Voltage drops add to the source voltage",
    ],
    generatorIds: ["circuits.series-parallel"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "circuits.power",
    domain: "circuits",
    title: "Electrical power",
    knowledgePoints: [
      "Power is energy transferred per second",
      "P = V I",
      "P = I² R and P = V² / R follow from Ohm's law",
      "Choosing the form that matches the known quantities",
    ],
    generatorIds: ["circuits.power"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "circuits.parallel",
    domain: "circuits",
    title: "Parallel circuits",
    knowledgePoints: [
      "Branches provide separate paths",
      "Each branch sees the full source voltage",
      "Branch currents add",
      "Equivalent resistance is less than the smallest branch",
    ],
    generatorIds: ["circuits.series-parallel"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "balance.equivalence",
    domain: "balance",
    title: "Equivalent expressions",
    knowledgePoints: [
      "An equation is a statement that two expressions have the same value",
      "Combining like terms preserves value",
      "A solution is a value that makes both sides equal",
    ],
    generatorIds: ["balance.linear-one-step", "balance.linear-two-step"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "balance.operations",
    domain: "balance",
    title: "Balanced operations",
    knowledgePoints: [
      "Adding or subtracting the same quantity on both sides preserves equality",
      "Multiplying or dividing both sides by the same nonzero quantity preserves equality",
      "Choosing an operation that isolates the unknown",
    ],
    generatorIds: ["balance.linear-one-step", "balance.linear-two-step"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "mechanics.torque",
    domain: "mechanics",
    title: "Torque",
    knowledgePoints: [
      "Torque is force times perpendicular distance from the pivot",
      "A lever balances when the torques on each side match",
      "Moving an effort farther from the pivot increases its turning effect",
      "A smaller force can balance a larger load when it acts farther out",
    ],
    generatorIds: ["mechanics.torque"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "mechanics.mechanical-advantage",
    domain: "mechanics",
    title: "Mechanical advantage",
    knowledgePoints: [
      "Mechanical advantage is the ratio of load force to effort force",
      "Ideal mechanical advantage equals effort distance divided by load distance",
      "Work is conserved: machines trade force for distance moved",
      "Amplifying force requires proportionally greater displacement",
    ],
    generatorIds: ["mechanics.mechanical-advantage"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "optics.refraction",
    domain: "optics",
    title: "Refraction and Snell's law",
    knowledgePoints: [
      "Light wave speed changes at boundaries between differing optical media",
      "Index of refraction n = c / v",
      "Snell's law: n1 sin(θ1) = n2 sin(θ2)",
      "Rays bend towards the normal in denser media and away in less dense media",
    ],
    generatorIds: ["optics.refraction"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "optics.thin-lens",
    domain: "optics",
    title: "Thin lenses",
    knowledgePoints: [
      "Converging lenses focus rays at the focal length f",
      "Thin lens formula: 1/f = 1/do + 1/di",
      "Magnification M = -di / do relates image height to object height",
      "Objects outside the focal length form real inverted images; inside form virtual upright images",
    ],
    generatorIds: ["optics.thin-lens"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "chemistry.rate-laws",
    domain: "chemistry",
    title: "Reaction rates and rate laws",
    knowledgePoints: [
      "Reaction rate measures concentration change per unit time",
      "Rate laws express velocity: Rate = k[A]^m [B]^n",
      "Reaction orders are determined experimentally from rate variation with concentration",
      "Collision theory relates molecular collisions and activation energy to reaction rate",
    ],
    generatorIds: ["chemistry.rate-law"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "chemistry.half-life",
    domain: "chemistry",
    title: "First-order kinetics and half-life",
    knowledgePoints: [
      "Half-life is the time required for concentration to halve",
      "For first-order reactions, half-life is constant: t_1/2 = ln(2) / k",
      "Fraction remaining after n half-lives is (1/2)^n",
      "Half-life is independent of initial concentration in first-order processes",
    ],
    generatorIds: ["chemistry.half-life"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "logic.boolean-operators",
    domain: "logic",
    title: "Boolean operators",
    knowledgePoints: [
      "AND outputs true only when all inputs are true",
      "OR outputs true when at least one input is true",
      "NOT inverts the input signal",
      "Truth tables enumerate all possible input combinations",
    ],
    generatorIds: ["logic.gates"],
    provenance: "textbook",
    confidence: "high",
  },
  {
    id: "logic.composite-gates",
    domain: "logic",
    title: "Composite gates and universality",
    knowledgePoints: [
      "XOR outputs true when inputs are different (parity detector)",
      "NAND and NOR are universal gates capable of building any Boolean circuit",
      "De Morgan's laws state NOT(A AND B) = (NOT A) OR (NOT B)",
      "Complex logic circuits combine elementary gates to compute arithmetic",
    ],
    generatorIds: ["logic.gates"],
    provenance: "textbook",
    confidence: "high",
  },
];

export const CONCEPT_EDGES: ConceptEdge[] = [
  {
    from: "circuits.series",
    to: "circuits.ohms-law",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "circuits.parallel",
    to: "circuits.ohms-law",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "circuits.ohms-law",
    to: "circuits.power",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "circuits.series",
    to: "circuits.parallel",
    type: "confusable",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "balance.equivalence",
    to: "balance.operations",
    type: "encompasses",
    weight: 0.7,
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "mechanics.torque",
    to: "mechanics.mechanical-advantage",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "optics.refraction",
    to: "optics.thin-lens",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "chemistry.rate-laws",
    to: "chemistry.half-life",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
  {
    from: "logic.boolean-operators",
    to: "logic.composite-gates",
    type: "prerequisite",
    provenance: "authored",
    confidence: "high",
  },
];

export const LESSONS: LessonDoc[] = [
  circuits01,
  circuits02,
  circuits03,
  circuits04,
  balance01,
  balance02,
  balance03,
  mechanics01,
  mechanics02,
  mechanics03,
  optics01,
  optics02,
  optics03,
  chemistry01,
  chemistry02,
  chemistry03,
  logic01,
  logic02,
].map((lesson) => validateLesson(lesson));

export function lessonsForCourse(courseId: string): LessonDoc[] {
  return LESSONS.filter((lesson) => lesson.metadata.courseId === courseId).sort(
    (a, b) => a.metadata.order - b.metadata.order,
  );
}
