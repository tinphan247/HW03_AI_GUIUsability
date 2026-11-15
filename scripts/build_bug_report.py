"""build_bug_report.py — Sinh Bug_Reports.md + copy screenshot evidence từ bug_map.json.

Chạy: python scripts/build_bug_report.py

Nguồn:
    evidence/bug_map.json              — 34 bug, mapping item -> bug
    evidence/checklist_results.json    — evidence của item automated
    evidence/manual_results.json       — evidence của item manual
    evidence/created_issues.json       — (tuỳ chọn) number/url GitHub Issue

Đầu ra:
    Bug_Reports.md
    screenshots/bugs/<bug-id>.png
"""
import json
import os
import shutil
from datetime import date
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUG_MAP = os.path.join(ROOT, "evidence", "bug_map.json")
AUTO = os.path.join(ROOT, "evidence", "checklist_results.json")
MANUAL = os.path.join(ROOT, "evidence", "manual_results.json")
ISSUES = os.path.join(ROOT, "evidence", "created_issues.json")
OUT = os.path.join(ROOT, "Bug_Reports.md")
SHOTS = os.path.join(ROOT, "screenshots", "bugs")


def load(path, default=None):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main():
    data = load(BUG_MAP)
    bugs = data["bugs"]
    auto = load(AUTO, {}).get("results", {})
    manual = load(MANUAL, {}).get("results", {})
    issues = load(ISSUES, {})
    resolved = {}
    for k, v in auto.items():
        resolved[k] = v
    for k, v in manual.items():
        resolved[k] = v

    os.makedirs(SHOTS, exist_ok=True)
    for b in bugs:
        primary = b["primaryItem"]
        ev = resolved.get(primary, {}).get("evidence")
        b["evidence"] = None
        if ev and os.path.exists(os.path.join(ROOT, ev)):
            dst_rel = f"screenshots/bugs/{b['id']}.png"
            shutil.copyfile(os.path.join(ROOT, ev), os.path.join(ROOT, dst_rel))
            b["evidence"] = dst_rel

    sev_order = ["Blocker", "Major", "Minor", "Cosmetic"]
    sev_count = Counter(b["severity"] for b in bugs)
    all_items = sorted({i for b in bugs for i in b["items"]})

    lines = [
        "# Bug Reports — HW03 GUI & Usability",
        "",
        "**Student:** Phan Trung Tin — 23120372  ",
        "**SUT:** EShop — web `http://localhost:5173`, admin `http://localhost:5174`, API `http://localhost:3001/api`  ",
        f"**Ngày:** {date.today().strftime('%d/%m/%Y')}  ",
        "**Môi trường:** Chromium 141 (Playwright 1.64.1), viewport 1280×800; mobile 375×812  ",
        "**Tài khoản:** `test@eshop.com / Test1234!` · admin `admin@eshop.com / Admin123!`",
        "",
        "> Mỗi bug dưới đây tương ứng **1 GitHub Issue** có screenshot đính kèm.",
        "> Một bug có thể gộp nhiều checklist item cùng nguyên nhân (cột `Checklist item`).",
        "> Severity: **Blocker** (không hoàn thành được tác vụ / sai toàn vẹn dữ liệu) · **Major** (hoàn thành được nhưng sai kết quả hoặc phải workaround) · **Minor** (ảnh hưởng trải nghiệm) · **Cosmetic** (thuần thẩm mỹ).",
        "",
        "## Tổng hợp",
        "",
        "| Severity | Số bug |",
        "| :--- | ---: |",
    ]
    for s in sev_order:
        lines.append(f"| {s} | {sev_count.get(s, 0)} |")
    lines += [
        f"| **Tổng** | **{len(bugs)}** |",
        "",
        f"Bug phủ **{len(all_items)}/44** checklist item Failed. "
        "Screenshot của mọi item Failed nằm trong `screenshots/checklist/`; "
        "bản copy theo bug nằm trong `screenshots/bugs/`.",
        "",
        "| Bug ID | Title | Severity | Screen | Checklist item | Issue |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    for b in bugs:
        issue = issues.get(b["id"], {})
        issue_cell = f"[#{issue['number']}]({issue['url']})" if issue else "TODO"
        title = b["title"].replace("|", "\\|")
        items = ", ".join(b["items"])
        lines.append(
            f"| [{b['id']}](#{b['id'].lower()}--{slug(b['title'])}) | {title} | {b['severity']} | {b['screen']} | {items} | {issue_cell} |"
        )

    lines += ["", "---", ""]
    for b in bugs:
        lines += [
            f'## {b["id"]} — {b["title"]}',
            "",
            "| Field | Value |",
            "| :--- | :--- |",
            f'| Checklist item | {", ".join(b["items"])} |',
            f'| Screen / URL | {b["screen"]} — `{b["url"]}` |',
            f'| Severity | **{b["severity"]}** |',
            f'| Spec reference | {b["spec"]} |',
            "| Detected by | Checklist execution (automated + manual review) |",
            "",
            "**Steps to reproduce**",
            "",
        ]
        for i, s in enumerate(b["steps"], start=1):
            lines.append(f"{i}. {s}")
        lines += [
            "",
            f'**Expected** — {b["expected"]}',
            "",
            f'**Actual** — {b["actual"]}',
            "",
            f'**Impact** — {b["impact"]}',
            "",
        ]
        if b["evidence"]:
            lines += [
                f'**Evidence** — `{b["evidence"]}`',
                "",
                f'![{b["id"]} — {b["title"]}]({b["evidence"]})',
            ]
        else:
            lines.append("**Evidence:** (xem `screenshots/checklist/`)")
        lines.append("")
        issue = issues.get(b["id"], {})
        if issue:
            lines.append(f'**GitHub Issue:** [#{issue["number"]}]({issue["url"]})')
        else:
            lines.append("**GitHub Issue:** TODO")
        lines += ["", "---", ""]

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    missing = [b["id"] for b in bugs if not b["evidence"]]
    print(f"Wrote {OUT} ({len(bugs)} bugs)")
    if missing:
        print("WARN missing evidence:", missing)


def slug(text):
    keep = []
    for ch in text.lower():
        if ch.isalnum() or ch == " ":
            keep.append(ch)
        elif ch in "-_":
            keep.append(ch)
    s = "".join(keep).strip().replace(" ", "-")
    while "--" in s:
        s = s.replace("--", "-")
    return s


if __name__ == "__main__":
    main()
