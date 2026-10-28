"""Convert workflow journal results into per-dimension research markdown files.

Usage: python -I journal_to_md.py <journal.jsonl> <out_dir>
Research results -> <out_dir>/<NN>-<dimension>.md
Verification results are merged into the matching dimension file when present.
"""
import json
import sys
from pathlib import Path

ORDER = [
    "catalog_history",
    "help_center_sweep",
    "lesson_player_ux",
    "engineering_design_ai",
    "learning_engine_patterns",
    "oss_building_blocks",
    "user_voice",
]
TITLES = {
    "catalog_history": "Catalog history: how Brilliant's breadth narrowed",
    "help_center_sweep": "Help Center sweep: product mechanics",
    "lesson_player_ux": "Lesson player UX (secondary sources)",
    "engineering_design_ai": "Engineering, design, AI architecture, and product strategy",
    "learning_engine_patterns": "Learning-engine patterns for a local, single-user app",
    "oss_building_blocks": "Open-source building blocks and prior art",
    "user_voice": "Learner voice: themes and improvement opportunities",
}


def esc(s):
    return str(s).replace("|", "\\|").replace("\n", " ").strip()


def main():
    journal, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    research, verify, critic = {}, {}, None
    for line in journal.read_text(encoding="utf-8").splitlines():
        rec = json.loads(line)
        if rec.get("type") != "result":
            continue
        r = rec.get("result")
        if isinstance(r, dict) and "findings" in r and "dimension" in r:
            research[r["dimension"]] = r
        elif isinstance(r, dict) and "checks" in r:
            # verification results carry no dimension; map by finding-id prefix
            ids = [c.get("id", "") for c in r["checks"]]
            prefix = ids[0].split("-")[0] if ids else ""
            verify[prefix] = r
        elif isinstance(r, str) and len(r) > 200:
            critic = r

    written = []
    for n, dim in enumerate(ORDER, start=2):
        if dim not in research:
            continue
        r = research[dim]
        f = r["findings"]
        prefix = f[0]["id"].split("-")[0] if f else ""
        v = verify.get(prefix)
        vmap = {c["id"]: c for c in v["checks"]} if v else {}
        lines = [f"# {TITLES.get(dim, dim)}", ""]
        lines.append(f"- **Dimension:** `{dim}`")
        lines.append(f"- **Findings:** {len(f)} ({sum(1 for x in f if x.get('load_bearing'))} load-bearing)")
        if v:
            verdicts = {}
            for c in v["checks"]:
                verdicts[c["verdict"]] = verdicts.get(c["verdict"], 0) + 1
            summary = ", ".join(f"{k}: {n}" for k, n in sorted(verdicts.items()))
            lines.append(f"- **Adversarial verification:** {summary}")
        else:
            lines.append("- **Adversarial verification:** pending. Treat these findings as unverified.")
        lines += ["", "> Epistemic markers: `verified` = official Brilliant source; `observed` = docs, demos, archives,",
                  "> reviews; `inferred` = reasoning. Tier: 1 official … 7 third-party.", ""]
        lines += ["## Findings", ""]
        for x in f:
            lb = " ★" if x.get("load_bearing") else ""
            lines.append(f"### {x['id']}{lb}: {x['claim'].strip()}")
            lines.append("")
            lines.append(f"- **Status:** `{x['epistemic']}` · Tier {x['source_tier']} · <{x['source_url']}>")
            if x["id"] in vmap:
                c = vmap[x["id"]]
                note = f"- **Verification:** **{c['verdict']}**"
                if c["verdict"] != "confirmed" and c.get("corrected_claim"):
                    note += f". Correction: {c['corrected_claim'].strip()}"
                    if c.get("corrected_epistemic") not in (None, "", "n/a"):
                        note += f" (`{c['corrected_epistemic']}`)"
                if c.get("note"):
                    note += f". Note: {c['note'].strip()}"
                lines.append(note)
            lines.append(f"- **Detail:** {x['detail'].strip()}")
            lines.append("")
        lines += ["## Implications for the rebuild", ""]
        lines += [f"- {i.strip()}" for i in r.get("implications", [])]
        lines += ["", "## Open questions", ""]
        lines += [f"- {q.strip()}" for q in r.get("open_questions", [])]
        if v and v.get("summary"):
            lines += ["", "## Verifier summary", "", v["summary"].strip()]
        path = out_dir / f"{n:02d}-{dim.replace('_', '-')}.md"
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        written.append((path.name, len(f), bool(v)))

    if critic:
        (out_dir / "09-completeness-critic.md").write_text(
            "# Completeness critic\n\n" + critic.strip() + "\n", encoding="utf-8")
        written.append(("09-completeness-critic.md", 0, True))

    for name, n, ver in written:
        print(f"{name}: {n} findings, verified={ver}")
    missing = [d for d in ORDER if d not in research]
    print("missing dimensions:", missing)


if __name__ == "__main__":
    main()
