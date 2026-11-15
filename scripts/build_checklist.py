"""build_checklist.py — Sinh GUI_Checklist.xlsx + execution_log.md từ JSON kết quả.

Chạy (từ thư mục gốc bài làm):
    python scripts/build_checklist.py

Nguồn:
    checklist/checklist_items.json      — 65 item thiết kế
    evidence/checklist_results.json     — kết quả automated
    evidence/manual_results.json        — kết quả manual (nếu có)

Đầu ra:
    checklist/GUI_Checklist.xlsx
    checklist/execution_log.md
"""
import json
import os
from datetime import date
from collections import Counter, defaultdict

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ITEMS = os.path.join(ROOT, "checklist", "checklist_items.json")
AUTO = os.path.join(ROOT, "evidence", "checklist_results.json")
MANUAL = os.path.join(ROOT, "evidence", "manual_results.json")
XLSX = os.path.join(ROOT, "checklist", "GUI_Checklist.xlsx")
LOG = os.path.join(ROOT, "checklist", "execution_log.md")

HEADER_FILL = PatternFill("solid", fgColor="1F4E79")
HEADER_FONT = Font(color="FFFFFF", bold=True, size=10)
FAIL_FILL = PatternFill("solid", fgColor="FCE4E4")
PASS_FILL = PatternFill("solid", fgColor="E2EFDA")
THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def load(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main():
    data = load(ITEMS)
    items = data["items"]
    auto = load(AUTO).get("results", {})
    manual = load(MANUAL).get("results", {})
    merged = {}
    merged.update(auto)
    merged.update({k: v for k, v in manual.items() if v})

    wb = Workbook()
    ws = wb.active
    ws.title = "Checklist"

    cols = [
        ("No", 5), ("ID", 11), ("Aspect", 8), ("Screen", 20), ("Checklist item", 52),
        ("Expected", 46), ("Spec ref", 13), ("Method", 11), ("Priority", 9), ("Origin", 9),
        ("Result", 13), ("Evidence", 38), ("Notes (lý do Failed)", 60), ("Bug ID", 12),
    ]
    ws.append([c[0] for c in cols])
    for i, (name, width) in enumerate(cols, start=1):
        ws.column_dimensions[get_column_letter(i)].width = width
        cell = ws.cell(row=1, column=i)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(vertical="center", horizontal="center", wrap_text=True)
        cell.border = BORDER
    ws.row_dimensions[1].height = 30

    bug_map = {}
    bug_list = []
    bug_file = os.path.join(ROOT, "evidence", "bug_map.json")
    if os.path.exists(bug_file):
        bm = load(bug_file)
        bug_map = bm.get("items", {})
        bug_list = bm.get("bugs", [])

    for idx, it in enumerate(items, start=1):
        r = merged.get(it["id"], {})
        result = r.get("status", "Not executed")
        note = r.get("note", "")
        evidence = r.get("evidence", "")
        ws.append([
            idx, it["id"], it["ia"], it["screen"], it["item"], it["expected"], it["spec"],
            it["method"], it["priority"], it["origin"], result, evidence, note,
            bug_map.get(it["id"], ""),
        ])
        row = ws.max_row
        for c in range(1, len(cols) + 1):
            ws.cell(row=row, column=c).border = BORDER
            ws.cell(row=row, column=c).alignment = Alignment(vertical="top", wrap_text=True)
        fill = PASS_FILL if result == "Passed" else FAIL_FILL if result == "Failed" else None
        if fill:
            ws.cell(row=row, column=11).fill = fill
        ws.cell(row=row, column=11).alignment = Alignment(horizontal="center", vertical="top")
        ws.cell(row=row, column=1).alignment = Alignment(horizontal="center", vertical="top")

    dv = DataValidation(type="list", formula1='"Passed,Failed,Not executed,Blocked"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(f"K2:K{ws.max_row}")
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:N{ws.max_row}"

    # ---- Summary sheet ----
    sm = wb.create_sheet("Summary")
    sm.column_dimensions["A"].width = 30
    for c in "BCDEFG":
        sm.column_dimensions[c].width = 14

    total = len(items)
    count = Counter(merged.get(i["id"], {}).get("status", "Not executed") for i in items)
    bugs = len(bug_list)

    sm["A1"] = "HW03 — GUI Checklist: Test summary"
    sm["A1"].font = Font(bold=True, size=14, color="1F4E79")
    rows = [
        ("Ngày thực thi", date.today().strftime("%d/%m/%Y")),
        ("SUT", "EShop — http://localhost:5173 (web), http://localhost:5174 (admin)"),
        ("Tổng item thiết kế", total),
        ("Đã thực thi", total - count.get("Not executed", 0)),
        ("Passed", count.get("Passed", 0)),
        ("Failed", count.get("Failed", 0)),
        ("Not executed", count.get("Not executed", 0)),
        ("Số bug ghi nhận", bugs),
        ("Tỉ lệ pass", f"{(count.get('Passed', 0) / total * 100):.1f}%"),
    ]
    for i, (k, v) in enumerate(rows, start=3):
        sm.cell(row=i, column=1, value=k).font = Font(bold=True)
        sm.cell(row=i, column=2, value=v)

    sm["A13"] = "Theo interface aspect"
    sm["A13"].font = Font(bold=True, size=12)
    hdr = ["Aspect", "Items", "Passed", "Failed", "Not executed", "Pass rate"]
    for j, h in enumerate(hdr, start=1):
        cell = sm.cell(row=14, column=j, value=h)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.border = BORDER
    by = defaultdict(list)
    for it in items:
        by[it["ia"]].append(it["id"])
    row = 15
    for ia in sorted(by):
        ids = by[ia]
        p = sum(1 for i in ids if merged.get(i, {}).get("status") == "Passed")
        f = sum(1 for i in ids if merged.get(i, {}).get("status") == "Failed")
        ne = len(ids) - p - f
        vals = [ia, len(ids), p, f, ne, f"{p / len(ids) * 100:.1f}%"]
        for j, v in enumerate(vals, start=1):
            sm.cell(row=row, column=j, value=v).border = BORDER
        row += 1

    # ---- Origin / gap-fill sheet ----
    gs = wb.create_sheet("AI vs Human")
    gs.column_dimensions["A"].width = 12
    gs.column_dimensions["B"].width = 60
    gs.column_dimensions["C"].width = 70
    gs["A1"] = "Item"
    gs["B1"] = "Nội dung"
    gs["C1"] = "Vì sao AI bỏ sót (item do sinh viên bổ sung)"
    for c in "ABC":
        gs[f"{c}1"].fill = HEADER_FILL
        gs[f"{c}1"].font = HEADER_FONT
    r = 2
    for it in items:
        if it["origin"] == "Human":
            gs.cell(row=r, column=1, value=it["id"])
            gs.cell(row=r, column=2, value=it["item"])
            gs.cell(row=r, column=3, value=it.get("whyMissed", ""))
            for c in range(1, 4):
                gs.cell(row=r, column=c).alignment = Alignment(wrap_text=True, vertical="top")
            r += 1

    wb.save(XLSX)
    print("Wrote", XLSX, f"({total} items)")

    # ---- execution_log.md ----
    lines = [
        "# Execution log — GUI Checklist",
        "",
        f"**Ngày:** {date.today().strftime('%d/%m/%Y')}  ",
        "**SUT:** EShop — web `http://localhost:5173`, admin `http://localhost:5174`  ",
        "**Công cụ:** Playwright 1.64.1 (Chromium) + axe-core 4.10.2 + kiểm tra thủ công có screenshot.",
        "",
        "| ID | Aspect | Screen | Result | Evidence | Notes |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    for it in items:
        r = merged.get(it["id"], {})
        st = r.get("status", "Not executed")
        ev = r.get("evidence") or "—"
        ev = f"[{os.path.basename(ev)}]({ev})" if ev != "—" else "—"
        note = (r.get("note") or "").replace("|", "\\|")
        lines.append(f"| {it['id']} | {it['ia']} | {it['screen']} | **{st}** | {ev} | {note} |")
    lines += [
        "",
        "## Tổng hợp",
        "",
        f"- Tổng item: **{total}**",
        f"- Passed: **{count.get('Passed', 0)}**",
        f"- Failed: **{count.get('Failed', 0)}**",
        f"- Not executed: **{count.get('Not executed', 0)}**",
        "",
        "> Ghi chú: item Failed luôn có screenshot trong `screenshots/checklist/`; item Passed không chụp (theo yêu cầu đề bài).",
    ]
    with open(LOG, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print("Wrote", LOG)


if __name__ == "__main__":
    main()
