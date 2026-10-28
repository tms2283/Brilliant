# Failure Modes & Effects Analysis (FMEA) — Noesis

**Stage:** Stage 5 (The Golden Gauntlet)  
**System:** Noesis  
**Date:** 2026-10-21  
**Scoring Formula:** $\text{RPN} = \text{Severity (1–10)} \times \text{Occurrence (1–10)} \times \text{Detection (1–10)}$  

### Threshold Invariants:
- **Critical Risk ($\text{RPN} \ge 200$):** Mandatory Block. Immediate fix required.
- **High Risk ($\text{RPN } 120\text{–}199$):** Block unless explicit executive mitigation is documented.
- **Medium Risk ($\text{RPN } 60\text{–}119$):** Conditional Pass with time-boxed SLA.
- **Low Risk ($\text{RPN } < 60$):** Monitored residual risk.

---

## 1. Failure Mode Evaluation Matrix

| ID | Failure Mode | Failure Effect | Severity (1–10) | Root Cause | Occurrence (1–10) | Current Control / Detection Mechanism | Detection (1–10) | RPN | Risk Level & Mitigation |
|:---:|:---|:---|:---:|:---|:---:|:---|:---:|:---:|:---|
| **FM-1** | SQLite Database Lock or File Corruption | Learner progress cannot be written; app throws write errors | **8** | Sudden OS crash, power loss, or ungraceful terminal kill during write transaction | **2** | WAL mode enabled (`PRAGMA journal_mode = WAL`); synchronous writes set to `NORMAL`; connection closes cleanly on SIGINT/SIGTERM | **3** | **48** | **Low Risk** · Monitored residual risk. Automated recovery on SQLite boot. |
| **FM-2** | Tutor Answer Leakage During Practice | Pedagogical integrity compromised; learner bypasses cognitive struggle | **6** | Third-party LLM adapter outputs raw solution numbers | **3** | `verifyTutorText()` regex prosecutes all drafts for "answer is" and numerical matches against the solution; falls back to deterministic local ladder | **2** | **36** | **Low Risk** · Verified by unit test suite (`tests/tutor.test.ts`). |
| **FM-3** | Memory Leak in Long-Running Lesson Session | Browser tab sluggishness after 50+ consecutive lessons | **5** | Retained DOM elements, dangling timers, or unsubscribed state listeners | **2** | XState v5 machines automatically dispose actors upon lesson transition; stateless functional components | **3** | **30** | **Low Risk** · Monitored. Memory heap remains steady under repeated test navigation. |
| **FM-4** | Malformed Custom Topic DAG | Curriculum path locks or enters infinite loop | **6** | User creates cyclic prerequisites or missing concepts | **4** | `critiqueGraph()` performs topological Kahn sort; detects cycles and isolates; rejects with 422 Unprocessable Entity | **1** | **24** | **Low Risk** · 100% deterministic detection; verified by `tests/topic.test.ts`. |
| **FM-5** | Ill-Conditioned Generated Item | Question impossible to solve (division by zero, negative resistance) | **7** | Random seed generates parameter edge cases | **3** | Evaluator gate: every item must pass domain evaluator (`evalReport.passed === true`) prior to emission | **1** | **21** | **Low Risk** · Gated at generation time; 0 eval failures in 100 seeded variants. |
| **FM-6** | Keyboard Trapping on Interactive Manipulative | Assistive technology / keyboard user cannot advance past simulation | **7** | Interactive slider or balance canvas fails to yield focus | **1** | All interactive controls implement standard button/input keyboard nudges; Tab order verified | **1** | **7** | **Low Risk** · Verified by Playwright reachability audit (26/26 controls accessible). |
| **FM-7** | Mobile Viewport Horizontal Clipping | Controls pushed off screen on small mobile devices | **5** | Fixed-width desktop layout | **1** | Responsive CSS media queries (`@media (max-width: 560px)`) wrap navigation, stats, and headers | **1** | **5** | **Low Risk** · Verified by Playwright mobile probe (375px width). |

---

## 2. FMEA Risk Summary

- **Total Assessed Failure Modes:** 7
- **Critical Risk Items ($\text{RPN} \ge 200$):** **0**
- **High Risk Items ($\text{RPN } 120\text{–}199$):** **0**
- **Medium Risk Items ($\text{RPN } 60\text{–}119$):** **0**
- **Low Risk Items ($\text{RPN } < 60$):** **7**

### Maximum RPN:
$$\text{Max RPN} = 48 \quad (\text{FM-1: SQLite write contention / abrupt shutdown})$$

**Conclusion:** All failure modes operate well below the critical and high risk thresholds. No unmitigated failure modes exist.
