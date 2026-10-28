import { DomainError } from "../errors.js";

export type CircuitMode = "series" | "parallel";

export interface Resistor {
  id: string;
  resistance: number;
}

export interface Circuit {
  mode: CircuitMode;
  sourceVoltage: number;
  resistors: Resistor[];
}

export interface BranchSolution {
  resistorId: string;
  resistance: number;
  current: number;
  voltageDrop: number;
  power: number;
}

export interface CircuitSolution {
  mode: CircuitMode;
  equivalentResistance: number;
  totalCurrent: number;
  totalPower: number;
  branches: BranchSolution[];
}

const EPSILON = 1e-9;

export function solveCircuit(circuit: Circuit): CircuitSolution {
  if (!Number.isFinite(circuit.sourceVoltage) || circuit.sourceVoltage < 0) {
    throw new DomainError("Source voltage must be a non-negative finite number");
  }
  if (circuit.resistors.length === 0) {
    throw new DomainError("A circuit needs at least one resistor");
  }
  for (const resistor of circuit.resistors) {
    if (!Number.isFinite(resistor.resistance) || resistor.resistance <= 0) {
      throw new DomainError(`Resistor ${resistor.id} must have positive resistance`);
    }
  }

  if (circuit.mode === "series") {
    const equivalentResistance = circuit.resistors.reduce((sum, resistor) => sum + resistor.resistance, 0);
    const totalCurrent = circuit.sourceVoltage / equivalentResistance;
    const branches = circuit.resistors.map((resistor) => ({
      resistorId: resistor.id,
      resistance: resistor.resistance,
      current: totalCurrent,
      voltageDrop: totalCurrent * resistor.resistance,
      power: totalCurrent * totalCurrent * resistor.resistance,
    }));
    return {
      mode: circuit.mode,
      equivalentResistance,
      totalCurrent,
      totalPower: circuit.sourceVoltage * totalCurrent,
      branches,
    };
  }

  const conductance = circuit.resistors.reduce((sum, resistor) => sum + 1 / resistor.resistance, 0);
  const equivalentResistance = 1 / conductance;
  const totalCurrent = circuit.sourceVoltage / equivalentResistance;
  const branches = circuit.resistors.map((resistor) => {
    const current = circuit.sourceVoltage / resistor.resistance;
    return {
      resistorId: resistor.id,
      resistance: resistor.resistance,
      current,
      voltageDrop: circuit.sourceVoltage,
      power: current * current * resistor.resistance,
    };
  });
  return {
    mode: circuit.mode,
    equivalentResistance,
    totalCurrent,
    totalPower: circuit.sourceVoltage * totalCurrent,
    branches,
  };
}

export interface CircuitCheck {
  name: string;
  passed: boolean;
  detail?: string;
}

/**
 * Independent consistency checks for a solved circuit. These catch solver
 * regressions and generator mistakes before an item can be shown.
 */
export function checkCircuit(circuit: Circuit, solution: CircuitSolution): CircuitCheck[] {
  const checks: CircuitCheck[] = [];
  const near = (a: number, b: number, tolerance = 1e-6) => Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));

  checks.push({
    name: "positive-equivalent-resistance",
    passed: solution.equivalentResistance > 0 && Number.isFinite(solution.equivalentResistance),
    detail: `Req=${solution.equivalentResistance}`,
  });
  checks.push({
    name: "branch-count",
    passed: solution.branches.length === circuit.resistors.length,
    detail: `${solution.branches.length}/${circuit.resistors.length}`,
  });

  if (circuit.mode === "series") {
    const dropSum = solution.branches.reduce((sum, branch) => sum + branch.voltageDrop, 0);
    checks.push({
      name: "series-voltage-sum",
      passed: near(dropSum, circuit.sourceVoltage),
      detail: `${dropSum} vs ${circuit.sourceVoltage}`,
    });
    checks.push({
      name: "series-current-equal",
      passed: solution.branches.every((branch) => near(branch.current, solution.totalCurrent)),
    });
  } else {
    const currentSum = solution.branches.reduce((sum, branch) => sum + branch.current, 0);
    checks.push({
      name: "parallel-current-sum",
      passed: near(currentSum, solution.totalCurrent),
      detail: `${currentSum} vs ${solution.totalCurrent}`,
    });
    checks.push({
      name: "parallel-voltage-equal",
      passed: solution.branches.every((branch) => near(branch.voltageDrop, circuit.sourceVoltage)),
    });
  }

  const powerSum = solution.branches.reduce((sum, branch) => sum + branch.power, 0);
  checks.push({
    name: "power-balance",
    passed: near(powerSum, solution.totalPower),
    detail: `${powerSum} vs ${solution.totalPower}`,
  });

  return checks;
}

export function isConsistent(circuit: Circuit, solution: CircuitSolution): boolean {
  return checkCircuit(circuit, solution).every((check) => check.passed);
}

export function assertConsistent(circuit: Circuit, solution: CircuitSolution): void {
  const failed = checkCircuit(circuit, solution).filter((check) => !check.passed);
  if (failed.length > 0) {
    throw new DomainError(`Circuit checks failed: ${failed.map((check) => check.name).join(", ")}`);
  }
  void EPSILON;
}
