#!/usr/bin/env python3
"""Noctairre theme check.

Run before every push:  python3 check_theme.py

Catches the failures that only surface after you've already uploaded a broken
theme to Shopify: malformed section schema, JSON templates pointing at sections
that don't exist, unbalanced Liquid tags, and snippets referenced but missing.

ponytail: no pytest, no fixtures. One file, asserts, exits non-zero on failure.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
FAILURES = []
CHECKED = 0


def fail(where, msg):
    FAILURES.append(f"{where}: {msg}")


def check(where, condition, msg):
    global CHECKED
    CHECKED += 1
    if not condition:
        fail(where, msg)


# ---------------------------------------------------------------------------
# 1. Every .json file parses
# ---------------------------------------------------------------------------
def check_json_files():
    for path in sorted(ROOT.rglob("*.json")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        if path.name in ("skills-lock.json",):
            continue
        try:
            json.loads(path.read_text(encoding="utf-8"))
            check(path.name, True, "")
        except json.JSONDecodeError as e:
            fail(str(path.relative_to(ROOT)), f"invalid JSON — {e}")


# ---------------------------------------------------------------------------
# 2. Every {% schema %} block parses and declares a name
# ---------------------------------------------------------------------------
SCHEMA_RE = re.compile(r"\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}", re.S)


def check_section_schemas():
    for path in sorted((ROOT / "sections").glob("*.liquid")):
        body = path.read_text(encoding="utf-8")
        match = SCHEMA_RE.search(body)
        rel = f"sections/{path.name}"

        if not match:
            fail(rel, "no {% schema %} block — Shopify will reject this section")
            continue

        try:
            schema = json.loads(match.group(1))
        except json.JSONDecodeError as e:
            fail(rel, f"schema is not valid JSON — {e}")
            continue

        check(rel, "name" in schema, "schema is missing a 'name'")

        # Block types must be unique, or the editor silently drops duplicates.
        types = [b.get("type") for b in schema.get("blocks", [])]
        check(rel, len(types) == len(set(types)), f"duplicate block types {types}")

        # Setting ids must be unique within a section.
        ids = [s.get("id") for s in schema.get("settings", []) if s.get("id")]
        check(rel, len(ids) == len(set(ids)), f"duplicate setting ids in {ids}")


# ---------------------------------------------------------------------------
# 3. JSON templates only reference sections that exist
# ---------------------------------------------------------------------------
def check_template_wiring():
    available = {p.stem for p in (ROOT / "sections").glob("*.liquid")}

    for path in sorted(ROOT.glob("templates/*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        rel = f"templates/{path.name}"
        sections = data.get("sections", {})

        for key, node in sections.items():
            stype = node.get("type")
            check(rel, stype in available, f"'{key}' references missing section '{stype}'")

        for key in data.get("order", []):
            check(rel, key in sections, f"order lists '{key}' which is not in sections")

    # Section groups too.
    for path in sorted(ROOT.glob("sections/*-group.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        rel = f"sections/{path.name}"
        for key, node in data.get("sections", {}).items():
            check(rel, node.get("type") in available, f"'{key}' references missing section '{node.get('type')}'")


# ---------------------------------------------------------------------------
# 4. Every {% render 'x' %} resolves to a snippet file
# ---------------------------------------------------------------------------
RENDER_RE = re.compile(r"\{%-?\s*render\s+'([a-z0-9_-]+)'")


def check_snippets():
    snippets = {p.stem for p in (ROOT / "snippets").glob("*.liquid")}

    for path in sorted(ROOT.rglob("*.liquid")):
        if ".git" in path.parts:
            continue
        rel = str(path.relative_to(ROOT))
        for name in set(RENDER_RE.findall(path.read_text(encoding="utf-8"))):
            check(rel, name in snippets, f"renders missing snippet '{name}'")


# ---------------------------------------------------------------------------
# 5. Liquid control tags are balanced
# ---------------------------------------------------------------------------
PAIRS = {"if": "endif", "unless": "endunless", "for": "endfor", "case": "endcase",
         "form": "endform", "paginate": "endpaginate", "capture": "endcapture",
         "comment": "endcomment", "schema": "endschema", "javascript": "endjavascript",
         "stylesheet": "endstylesheet"}

TAG_RE = re.compile(r"\{%-?\s*(\w+)")


def check_balance():
    for path in sorted(ROOT.rglob("*.liquid")):
        if ".git" in path.parts:
            continue
        rel = str(path.relative_to(ROOT))
        body = path.read_text(encoding="utf-8")

        # Strip {% liquid %} blocks — they use a different, tagless syntax.
        body = re.sub(r"\{%-?\s*liquid.*?-?%\}", "", body, flags=re.S)

        counts = {}
        for tag in TAG_RE.findall(body):
            counts[tag] = counts.get(tag, 0) + 1

        for opener, closer in PAIRS.items():
            check(
                rel,
                counts.get(opener, 0) == counts.get(closer, 0),
                f"{counts.get(opener, 0)} x {{% {opener} %}} but {counts.get(closer, 0)} x {{% {closer} %}}",
            )


# ---------------------------------------------------------------------------
# 6. Required theme files exist
# ---------------------------------------------------------------------------
def check_required():
    for rel in [
        "layout/theme.liquid",
        "config/settings_schema.json",
        "assets/noctairre.css",
        "assets/noctairre.js",
        "templates/index.json",
        "templates/product.json",
        "templates/collection.json",
        "templates/cart.json",
        "templates/404.json",
    ]:
        check("required", (ROOT / rel).exists(), f"missing {rel}")

    theme = (ROOT / "layout/theme.liquid").read_text(encoding="utf-8")
    check("layout/theme.liquid", "{{ content_for_header }}" in theme, "missing content_for_header")
    check("layout/theme.liquid", "{{ content_for_layout }}" in theme, "missing content_for_layout")


# ---------------------------------------------------------------------------
# 7. Accessibility + quality guards that are cheap to assert
# ---------------------------------------------------------------------------
def check_quality():
    css = (ROOT / "assets/noctairre.css").read_text(encoding="utf-8")
    check("css", "prefers-reduced-motion" in css, "no reduced-motion block")
    check("css", ":focus-visible" in css, "no visible focus styles")
    check("css", "100dvh" in css and "100vh;" not in css.replace("92vh", ""),
          "uses 100vh for a full-height section — iOS Safari will jump")

    js = (ROOT / "assets/noctairre.js").read_text(encoding="utf-8")
    check("js", "IntersectionObserver" in js, "scroll reveals should use IntersectionObserver")
    check("js", "addEventListener('scroll'" not in js, "scroll listener present — use IntersectionObserver")
    check("js", "prefers-reduced-motion" in js, "motion is not gated on prefers-reduced-motion")

    # Emoji must never be used as UI icons.
    emoji = re.compile("[\U0001F300-\U0001FAFF☀-➿]")
    for path in sorted(ROOT.rglob("*.liquid")):
        if ".git" in path.parts:
            continue
        hits = emoji.findall(path.read_text(encoding="utf-8"))
        check(str(path.relative_to(ROOT)), not hits, f"emoji used as UI: {hits[:3]}")


def main():
    check_json_files()
    check_section_schemas()
    check_template_wiring()
    check_snippets()
    check_balance()
    check_required()
    check_quality()

    print(f"Noctairre theme check — {CHECKED} assertions")

    if FAILURES:
        print(f"\n{len(FAILURES)} PROBLEM(S):\n")
        for f in FAILURES:
            print(f"  ✗ {f}")
        sys.exit(1)

    print("All checks passed.")
    sys.exit(0)


if __name__ == "__main__":
    main()
