function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export class Fraction {
  readonly n: number;
  readonly d: number;

  constructor(n: number, d = 1) {
    if (!Number.isFinite(n) || !Number.isFinite(d)) throw new Error("Fraction requires finite numbers");
    if (d === 0) throw new Error("Division by zero");
    const sign = d < 0 ? -1 : 1;
    const divisor = gcd(n, d);
    this.n = (sign * n) / divisor;
    this.d = Math.abs(d) / divisor;
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.n * other.d + other.n * this.d, this.d * other.d);
  }

  subtract(other: Fraction): Fraction {
    return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d);
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(this.n * other.n, this.d * other.d);
  }

  divide(other: Fraction): Fraction {
    return new Fraction(this.n * other.d, this.d * other.n);
  }

  isZero(): boolean {
    return this.n === 0;
  }

  isOne(): boolean {
    return this.n === 1 && this.d === 1;
  }

  isNegative(): boolean {
    return this.n < 0;
  }

  equals(other: Fraction): boolean {
    return this.n === other.n && this.d === other.d;
  }

  toNumber(): number {
    return this.n / this.d;
  }

  toString(): string {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
}

export const ZERO = new Fraction(0);

export function frac(n: number, d = 1): Fraction {
  return new Fraction(n, d);
}
