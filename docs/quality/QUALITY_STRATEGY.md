# Quality Strategy — Noesis Learning Engine

**Stage:** Stage 4 (Quality Strategist)  
**System:** Noesis (Offline-First Interactive STEM Learning Platform)  
**Date:** 2026-10-21  
**Status:** Approved & Baseline Certified  

---

## 1. Quality Policy & North Star

Noesis exists so a learner can master STEM concepts by doing — without network, paywalls, or accounts standing between them and the next insight.

In this architecture, **quality is not an end-of-pipe inspection.** It is an invariant property maintained across the pure core pipeline:
$$\text{Content Document} \longrightarrow \text{Item Materialization} \longrightarrow \text{Primitive Verdict} \longrightarrow \text{Attempt Event} \longrightarrow \text{Learner-State Projection}$$

### Axiomatic Quality Invariants:
1. **Myers Falsification Axiom:** The purpose of testing is to discover where assumptions crumble, not merely to demonstrate green happy paths.
2. **Deming Process Invariance:** 94% of defects originate from specification gaps and architectural seams. Code correctness begins with strict schema boundaries and layer isolation.
3. **Mutation Resistance:** Tests must actively reject faulty logic. High line coverage without assertion density and mutation kill capability is treated as unhedged liability.
4. **Zero Unquantified Risk:** Every identified failure mode is logged with explicit Risk Priority Numbers (RPN).

---

## 2. Risk Topology & Testing Geometry

### 2.1 Testing Geometry: The Verification Diamond
Because Noesis is a modular monolith combining pure computational engines (solvers, evaluators, DAG critics) with persistence projections and interactive UI primitives, we employ a **Verification Diamond**:

```
           / \
          / E2E\           Critical User Journey Smoke Test (Playwright / Harness)
         /------\
        /  API & \         Hono HTTP contract, SQLite persistence, schema rejection
       / Integrat \
      /------------\
     / Pure Domain  \      Circuit solver, balance solver, optics, kinetics,
    /   & Solvers    \     FSRS scheduler, topic DAG critics, tutor anti-leak
   /------------------\
  /    Zod Schemas     \   Single source of truth for runtime validation & types
 /----------------------\
```

### 2.2 Subsystem Risk Weighting & Allocation

| Subsystem | Risk Weight | Primary Failure Risk | Testing Strategy | Verification Mode |
|:---|:---:|:---|:---|:---|
| **Domain Solvers** | Critical (30%) | Incorrect physical simulation; impossible equations | Deterministic algebraic properties, conservation laws, 100 randomized seeds | Unit & Property |
| **Zod Schemas & Contracts** | Critical (25%) | Schema divergence, malformed API payloads | Bi-directional schema parse / rejection test suite | Contract Tests |
| **Learner & Scheduler Model** | High (15%) | Drift in mastery scores, broken FSRS spaced repetition | Model simulation, synthetic attempts, streak verification | Integration |
| **Topic DAG & Critics** | High (15%) | Cycles in curriculum, unresolvable lesson requirements | Graph cycle detection, topological order tests | Algorithmic Tests |
| **Tutor & Hint Guardrails** | High (10%) | Answer leaks during practice, hints during check | Regex anti-leak prosecution, policy error enforcement | Policy & Security |
| **UI Primitives & A11y** | Medium (5%) | Viewport overflow, keyboard traps, contrast failures | /user 3-persona journey harness, Playwright probes | Accessibility & E2E |

---

## 3. Specification & Requirements Quality Audit

### 3.1 Requirement Ambiguity & Testability

| Requirement | Ambiguity Pre-Audit | Formalized Invariant | Pass/Fail Gate |
|---|---|---|---|
| *Offline-First* | "Works without internet" | Local SQLite database + bundled assets; 0 outbound network calls on core loop | Verified: 100% offline capability |
| *Deterministic Content* | "Problems make sense" | Every item passes automated domain evaluator; seeds produce identical items | Verified: 100 seeded variants verified |
| *Pedagogical Protection* | "Don't give away answers" | Tutor cannot be called in `check` or `review` phases; answers & numbers scrubbed | Verified: 403 Forbidden on check phase; regex verification |
| *Accessibility* | "Easy to use for everyone" | Full keyboard navigation (all 26 controls reachable), skip link, WCAG AA contrast $\ge 4.5:1$ | Verified: /user automated audit clean |

---

## 4. Reverse Escalation Protocol

When defects or contract violations are detected during testing, they are classified into one of the Five Failure Classes:

```
┌────────────────────────────────────────────────────────────────────────┐
│ CLASS I: Specification Failure (Code matches spec, but spec was wrong) │
│ Escalation Route ──► Stage 1 (/masterplan) for Architecture Amendment  │
├────────────────────────────────────────────────────────────────────────┤
│ CLASS II: Implementation Failure (Code diverges from sound spec)       │
│ Escalation Route ──► Stage 3 (/master-coder) for Immediate Defect Fix  │
├────────────────────────────────────────────────────────────────────────┤
│ CLASS III: Integration & Seam Failure (Components clash at boundaries) │
│ Escalation Route ──► Stage 2 (/masterbuild) for Contract / ADR Update  │
├────────────────────────────────────────────────────────────────────────┤
│ CLASS IV: Temporal & Environmental Failure (Environment / race drift)  │
│ Escalation Route ──► Stage 2 (/masterbuild) & Stage 3 (/master-coder)  │
├────────────────────────────────────────────────────────────────────────┤
│ CLASS V: Assumption Failure (Unstated premise was false)               │
│ Escalation Route ──► Stage 1 (/masterplan) or Stage 2 (/masterbuild)   │
└────────────────────────────────────────────────────────────────────────┘
```
