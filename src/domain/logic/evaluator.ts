export type GateOp = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR";

export function evaluateGate(op: GateOp, a: boolean, b = false): boolean {
  switch (op) {
    case "AND":
      return a && b;
    case "OR":
      return a || b;
    case "NOT":
      return !a;
    case "XOR":
      return a !== b;
    case "NAND":
      return !(a && b);
    case "NOR":
      return !(a || b);
  }
}

export interface TruthTableEntry {
  a: boolean;
  b: boolean;
  output: boolean;
}

export function generateTruthTable(op: Exclude<GateOp, "NOT">): TruthTableEntry[] {
  const inputs: [boolean, boolean][] = [
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ];
  return inputs.map(([a, b]) => ({
    a,
    b,
    output: evaluateGate(op, a, b),
  }));
}
