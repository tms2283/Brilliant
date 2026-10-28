# Quality Debt Register — Noesis

**Stage:** Stage 4 (Quality Strategist)  
**System:** Noesis  
**Date:** 2026-10-21  
**Total Quality Debt Principal:** 6 hours  
**Weighted Churn Risk:** Low  

---

## 1. Quality Debt Invariant

Quality debt is the conscious decision to accept incomplete verification, missing telemetry, or deferred testing in order to meet an engineering milestone. Unlike hidden technical debt, quality debt must be **formally cataloged, assigned an estimated repayment principal (hours), evaluated for churn interest, and bound to a hard triggering horizon.**

---

## 2. Active Debt Register

| # | Subsystem | Debt Nature | Principal (Hours) | Churn Interest | Trigger Horizon / Due Date | Mitigation In Place |
|:---:|:---|:---|:---:|:---:|:---|:---|
| **QD-1** | `src/domain/topic/` | Topic proposal breadth: currently maps to 5 core STEM domains (circuits, balance, mechanics, optics, chemistry). Broader interdisciplinary topic generation currently rejects uncataloged domains with 422. | 4h | Low | Prior to public v1 release; curriculum expansion sprint. | Deterministic `UnsupportedTopicError` cleanly informs learner with 422 Unprocessable Entity instead of crashing. |
| **QD-2** | `src/ui/primitives/` | Touch-gesture micro-haptics on mobile slider: currently relies on standard browser touch events without dedicated touch-action spring physics. | 2h | Low | Mobile polish release. | Standard input sliders and left/right button nudge controls work on all mobile viewports. |

---

## 3. Repayment Roadmap

- **QD-1 Repayment:** Target Sprint 6 (Curriculum Expansion). Incorporate AST/physics engine for thermodynamics and wave mechanics.
- **QD-2 Repayment:** Target Mobile Polish milestone. Add PointerEvents haptic feedback for mobile touch devices.

---

## 4. Certification

No blocking or high-interest quality debt exists. The current debt profile presents zero threat to system stability or offline pedagogical correctness.
