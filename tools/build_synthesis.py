"""Build /synthesis artifacts from docs/synthesis/_source/features.py and run structural QA.

Usage (from the project root):  python -I tools/build_synthesis.py
Outputs:
  docs/synthesis/02-feature-matrix.csv
  docs/synthesis/02-feature-matrix.md
  docs/synthesis/04-selection-schema.yaml
Exit code 1 if any QA check fails (dangling dependency, cycle, MVP dependency on non-MVP, missing rationale).
"""
import csv
import runpy
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "synthesis" / "_source" / "features.py"
OUT = ROOT / "docs" / "synthesis"

SHORT = {
    "user_value": "UV", "use_frequency": "UF", "differentiation": "DF", "comprehensibility": "CP",
    "workflow_leverage": "WL", "implementation_complexity": "IC", "maintenance_burden": "MB",
    "privacy_risk": "PR", "feature_synergy": "FS", "mvp_fit": "MVP", "expansion_potential": "EP",
}
# core = first runnable milestone (deterministic learning loop, no LLM); v1 = completes the first full release;
# v1.x / v2 = deferred with promotion conditions; none = dropped.
RELEASE_ORDER = {"core": 0, "v1": 1, "v1.x": 2, "v2": 3, "none": 4}
IN_SCOPE = {"core", "v1"}
SOURCE_NAMES = {"B26": "Brilliant-2026", "BL": "Brilliant-Legacy", "NEW": "recommended-improvement"}


def load():
    ns = runpy.run_path(str(SRC))
    return ns["DIMS"], ns["FEATURES"]


def qa(dims, feats):
    errors, warnings = [], []
    names = {f["canonical_feature"] for f in feats}
    if len(names) != len(feats):
        dupes = [n for n, c in Counter(f["canonical_feature"] for f in feats).items() if c > 1]
        errors.append(f"duplicate canonical names: {dupes}")
    by = {f["canonical_feature"]: f for f in feats}
    for f in feats:
        n = f["canonical_feature"]
        for d in f["dependencies"]:
            if d not in names:
                errors.append(f"{n}: dangling dependency '{d}'")
        if not f["rationale"].strip():
            errors.append(f"{n}: missing rationale")
        if f["recommended_state"] == "merge" and "merge" not in f["recommended_source_pattern"].lower():
            errors.append(f"{n}: merge without merge logic in recommended_source_pattern")
        if f["release"] not in RELEASE_ORDER:
            errors.append(f"{n}: unknown release '{f['release']}'")
            continue
        if f["recommended_state"] in ("keep", "merge") and f["release"] not in IN_SCOPE:
            errors.append(f"{n}: {f['recommended_state']} but scheduled outside v1.0 ({f['release']})")
        if f["recommended_state"] == "defer" and f["release"] not in ("v1.x", "v2"):
            errors.append(f"{n}: deferred feature scheduled in {f['release']}")
        if f["recommended_state"] == "drop" and f["release"] != "none":
            errors.append(f"{n}: dropped feature scheduled for release {f['release']}")
        if f["recommended_state"] == "investigate":
            warnings.append(f"{n}: investigate — open question must be named in rationale")
        if not f["score_notes"].strip():
            errors.append(f"{n}: missing score_notes for extreme scores")
        # Release closure: a feature may only depend on features shipping in the same or an earlier milestone.
        for d in f["dependencies"]:
            if d in by and by[d]["release"] in RELEASE_ORDER and \
                    RELEASE_ORDER[by[d]["release"]] > RELEASE_ORDER[f["release"]]:
                errors.append(f"{n} ({f['release']}) depends on later {d} ({by[d]['release']})")
    # cycle detection (DFS)
    state = {}

    def visit(n, stack):
        state[n] = 1
        for d in by[n]["dependencies"]:
            if d not in by:
                continue
            if state.get(d) == 1:
                errors.append("dependency cycle: " + " -> ".join(stack + [n, d]))
            elif state.get(d) is None:
                visit(d, stack + [n])
        state[n] = 2

    for n in by:
        if state.get(n) is None:
            visit(n, [])
    # epistemic sanity: NEW-only features must be 'recommended'
    for f in feats:
        if f["source_products"] == ["NEW"] and f["evidence_tier"] != "recommended":
            warnings.append(f"{f['canonical_feature']}: NEW-only feature not marked 'recommended'")
    return errors, warnings


def topo_layers(feats, release):
    by = {f["canonical_feature"]: f for f in feats if f["release"] == release}
    layer, remaining = {}, set(by)
    level = 0
    while remaining:
        ready = {n for n in remaining if all(d not in remaining for d in by[n]["dependencies"] if d in by)}
        if not ready:
            break
        for n in ready:
            layer[n] = level
        remaining -= ready
        level += 1
    return layer


def write_csv(dims, feats):
    cols = ["canonical_feature", "cluster", "source_products", "description", "user_value_why",
            "overlap_status", "workflow_role", "inputs", "outputs", "dependencies"] + \
           [f"score_{d}" for d in dims] + \
           ["recommended_state", "release", "rationale", "recommended_source_pattern",
            "confidence", "evidence_tier", "score_notes", "refs"]
    with open(OUT / "02-feature-matrix.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(cols)
        for f in feats:
            w.writerow([
                f["canonical_feature"], f["cluster"],
                "; ".join(SOURCE_NAMES[s] for s in f["source_products"]),
                f["description"], f["user_value_text"], f["overlap_status"], f["workflow_role"],
                f["inputs"], f["outputs"], "; ".join(f["dependencies"]),
                *[f["scores"][d] for d in dims],
                f["recommended_state"], f["release"], f["rationale"], f["recommended_source_pattern"],
                f["confidence"], f["evidence_tier"], f["score_notes"], "; ".join(f["refs"]),
            ])


def md_escape(s):
    return str(s).replace("|", "\\|")


def write_md(dims, feats, errors, warnings):
    clusters = defaultdict(list)
    for f in feats:
        clusters[f["cluster"]].append(f)
    states = Counter(f["recommended_state"] for f in feats)
    rel = Counter(f["release"] for f in feats)
    lines = [
        "# Unified feature matrix (Artifact 2)",
        "",
        "> Generated by `tools/build_synthesis.py` from `docs/synthesis/_source/features.py`. Don't edit by hand.",
        "> Spreadsheet version: `02-feature-matrix.csv` (every field, all 11 dimensions).",
        "",
        f"- **Canonical features:** {len(feats)} across {len(clusters)} clusters.",
        "- **States:** " + ", ".join(f"{k}: {v}" for k, v in sorted(states.items())) + ".",
        "- **Releases:** " + ", ".join(f"{k}: {v}" for k, v in sorted(rel.items(), key=lambda kv: RELEASE_ORDER[kv[0]])) + ".",
        "- **Sources:** B26 = Brilliant-2026, BL = Brilliant-Legacy (2014–2024), NEW = recommended improvement "
        "(its pattern source is named in the rationale).",
        "- **Score key (1–5):**",
        "  - UV user value, UF use frequency, DF differentiation, CP comprehensibility, WL workflow leverage,"
        " FS feature synergy, MVP mvp fit, EP expansion potential. Higher is better.",
        "  - **IC** implementation complexity, **MB** maintenance burden, **PR** privacy risk. **Higher is costlier.**",
        "  - Per the skill's rules, scores are never collapsed into a single rank.",
        "",
        f"**Structural QA:** {'PASS' if not errors else 'FAIL'} ({len(errors)} errors, {len(warnings)} warnings).",
        "",
    ]
    for e in errors:
        lines.append(f"- ❌ {e}")
    for wn in warnings:
        lines.append(f"- ⚠️ {wn}")
    head = "| Feature | Src | Overlap | State | Release | " + " | ".join(SHORT[d] for d in dims) + " |"
    sep = "|" + "---|" * (5 + len(dims))
    for c, fs in clusters.items():
        lines += ["", f"## {c}", "", head, sep]
        for f in fs:
            src = "+".join(f["source_products"])
            sc = " | ".join(str(f["scores"][d]) for d in dims)
            lines.append(f"| `{f['canonical_feature']}` | {src} | {f['overlap_status']} | **{f['recommended_state']}** "
                         f"| {f['release']} | {sc} |")
        lines.append("")
        for f in fs:
            lines.append(f"- **`{f['canonical_feature']}`** ({f['workflow_role']}, `{f['evidence_tier']}`, "
                         f"confidence {f['confidence']})")
            lines.append(f"  - **What:** {md_escape(f['description'])}")
            lines.append(f"  - **Why users care:** {md_escape(f['user_value_text'])}")
            lines.append(f"  - **Inputs:** {md_escape(f['inputs'])}")
            lines.append(f"  - **Outputs:** {md_escape(f['outputs'])}")
            if f["dependencies"]:
                lines.append(f"  - **Depends on:** " + ", ".join(f"`{d}`" for d in f["dependencies"]))
            lines.append(f"  - **Decision:** {md_escape(f['rationale'])}")
            lines.append(f"  - **Pattern:** {md_escape(f['recommended_source_pattern'])}")
            lines.append(f"  - **Score notes:** {md_escape(f['score_notes'])}")
            lines.append(f"  - **Evidence:** " + ", ".join(f["refs"]))
    (OUT / "02-feature-matrix.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def yq(s):
    s = str(s)
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def write_yaml(dims, feats):
    layers = {r: topo_layers(feats, r) for r in ("core", "v1", "v1.x", "v2")}
    out = ["# Selection schema (Artifact 4). Generated by tools/build_synthesis.py; don't edit by hand.",
           "# overrides_allowed: the user or a downstream agent may flip state/release; rerun the build to re-check QA.",
           "# build_layer: topological layer within the feature's release (0 = no in-release dependencies).",
           "feature_selection:"]
    for f in sorted(feats, key=lambda f: (RELEASE_ORDER[f["release"]],
                                            layers.get(f["release"], {}).get(f["canonical_feature"], 99),
                                            f["cluster"], f["canonical_feature"])):
        out.append(f"  - canonical_feature: {f['canonical_feature']}")
        out.append(f"    cluster: {f['cluster']}")
        out.append("    source_products: [" + ", ".join(SOURCE_NAMES[s] for s in f["source_products"]) + "]")
        out.append(f"    recommended_source_pattern: {yq(f['recommended_source_pattern'])}")
        out.append(f"    recommended_state: {f['recommended_state']}")
        out.append(f"    release: {yq(f['release'])}")
        if f["release"] in layers:
            out.append(f"    build_layer: {layers[f['release']].get(f['canonical_feature'], 'unresolved')}")
        out.append(f"    rationale: {yq(f['rationale'])}")
        out.append("    dependencies: [" + ", ".join(f["dependencies"]) + "]")
        out.append("    scores: {" + ", ".join(f"{d}: {f['scores'][d]}" for d in dims) + "}")
        out.append(f"    evidence_tier: {f['evidence_tier']}")
        out.append(f"    confidence: {f['confidence']}")
        out.append("    overrides_allowed: true")
    (OUT / "04-selection-schema.yaml").write_text("\n".join(out) + "\n", encoding="utf-8")


def main():
    dims, feats = load()
    errors, warnings = qa(dims, feats)
    write_csv(dims, feats)
    write_md(dims, feats, errors, warnings)
    write_yaml(dims, feats)
    print(f"features={len(feats)} errors={len(errors)} warnings={len(warnings)}")
    for e in errors:
        print("ERROR", e)
    for w in warnings:
        print("WARN", w)
    print("states", dict(Counter(f["recommended_state"] for f in feats)))
    print("release", dict(Counter(f["release"] for f in feats)))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
