"""sus_from_lines.py — Nhập dữ liệu 7 phiên usability từ 1 dòng/người.

Nguồn: usability/raw_sessions.txt (định dạng ở usability/FILL_7_SESSIONS.md)
    P1 | 22 | Sinh viên | 0912345678 | 15/11 19:00 | Chrome / Win 11 | Success | 4:30 | 0 | note | 4,2,5,1,4,2,5,1,4,2 | "quote"

Output (khi không dùng --dry-run):
    usability/participants.csv
    usability/sus_scores.csv

Chạy:
    python scripts/sus_from_lines.py --dry-run
    python scripts/sus_from_lines.py
"""
import argparse
import csv
import os
import re
import statistics
import sys

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "usability", "raw_sessions.txt")
P_CSV = os.path.join(ROOT, "usability", "participants.csv")
S_CSV = os.path.join(ROOT, "usability", "sus_scores.csv")

P_HEADER = [
    "participant_id", "age_range", "occupation", "contact_masked",
    "contact_full_local_only", "recruit_channel", "device", "prior_eshop_user",
    "session_date", "session_time", "consent_signed", "task_success",
    "time_seconds", "help_count", "sus_score", "valid_session", "notes",
]
S_HEADER = ["participant"] + [f"q{i}" for i in range(1, 11)] + ["valid_session", "note"]

SQL = "khong-do"


def age_range(age):
    try:
        a = int(age)
    except (TypeError, ValueError):
        return ""
    if a < 18:
        return "<18"
    if a <= 24:
        return "18-24"
    if a <= 34:
        return "25-34"
    if a <= 44:
        return "35-44"
    if a <= 54:
        return "45-54"
    return "55+"


def mask_contact(value):
    """Che 4 số giữa của SĐT 10 số, hoặc 3 ký tự giữa của email."""
    v = (value or "").strip()
    digits = re.sub(r"\D", "", v)
    if len(digits) >= 9 and "@" not in v:
        return digits[:3] + "***" + digits[-3:]
    if "@" in v:
        local, _, domain = v.partition("@")
        if len(local) <= 2:
            return f"{local[0]}***@{domain}"
        return f"{local[:2]}***@{domain}"
    return v


def parse_time(value):
    v = (value or "").strip().lower()
    if not v or v == SQL:
        return ""
    m = re.fullmatch(r"(\d+)\s*[:m]\s*(\d+)?\s*s?", v)
    if m:
        minutes = int(m.group(1))
        seconds = int(m.group(2) or 0)
        return minutes * 60 + seconds
    if re.fullmatch(r"\d+", v):
        return int(v)
    return ""


def parse_sus(value):
    v = (value or "").strip().lower()
    if not v or v == SQL:
        return []
    nums = [int(n) for n in re.findall(r"[1-5]", v)]
    if len(nums) != 10:
        return []
    return nums


def sus_score(answers):
    if len(answers) != 10:
        return ""
    total = 0
    for i, a in enumerate(answers, start=1):
        total += (a - 1) if i % 2 == 1 else (5 - a)
    return round(total * 2.5, 1)


def parse_lines(path):
    rows, errors = [], []
    if not os.path.exists(path):
        print(f"Chưa có {path} — tạo file theo hướng dẫn usability/FILL_7_SESSIONS.md")
        return rows, errors
    with open(path, encoding="utf-8-sig") as f:
        for lineno, raw in enumerate(f, start=1):
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            parts = [p.strip() for p in line.split("|")]
            if len(parts) < 7:
                errors.append(f"dòng {lineno}: cần ≥ 7 trường, có {len(parts)}")
                continue
            parts += [""] * (12 - len(parts))
            pid = parts[0] or f"P{len(rows) + 1}"
            sus_raw = parts[10]
            answers = parse_sus(sus_raw)
            if sus_raw.strip().lower() not in ("", SQL) and not answers:
                errors.append(f"dòng {lineno} ({pid}): SUS phải là 10 số 1..5 — đã để trống")
            rows.append({
                "pid": pid,
                "age": parts[1],
                "job": parts[2],
                "contact": parts[3],
                "when": parts[4],
                "device": parts[5],
                "success": parts[6],
                "time": parts[7],
                "help": parts[8],
                "coupon": parts[9],
                "sus": answers,
                "sus_raw": sus_raw,
                "quote": parts[11],
            })
    return rows, errors


def split_when(value):
    """'15/11 19:00' -> ('2026-11-15', '19:00')."""
    v = (value or "").strip()
    m = re.search(r"(\d{1,2})/(\d{1,2})(?:/(\d{2,4}))?\s*(\d{1,2}:\d{2})?", v)
    if not m:
        return "", ""
    day, month = int(m.group(1)), int(m.group(2))
    year = m.group(3) or "2026"
    year = f"20{year}" if len(year) == 2 else year
    return f"{year}-{month:02d}-{day:02d}", (m.group(4) or "")


def norm_success(value):
    v = (value or "").strip().lower()
    if v.startswith("s"):
        return "Success"
    if v.startswith("h"):
        return "Help"
    if v.startswith("f"):
        return "Failure"
    return ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="chỉ in, không ghi CSV")
    ap.add_argument("--input", default=SRC)
    args = ap.parse_args()

    rows, errors = parse_lines(args.input)
    for e in errors:
        print(f"  ! {e}")
    if not rows:
        print("Không có dòng dữ liệu nào để xử lý.")
        return 1

    p_rows, s_rows = [], []
    for r in rows:
        valid = bool(norm_success(r["success"]))
        date, time = split_when(r["when"])
        score = sus_score(r["sus"])
        note = r["quote"].strip().strip('"')
        p_rows.append({
            "participant_id": r["pid"],
            "age_range": age_range(r["age"]),
            "occupation": r["job"],
            "contact_masked": mask_contact(r["contact"]),
            "contact_full_local_only": r["contact"] if "@" in r["contact"] else re.sub(r"\D", "", r["contact"]),
            "recruit_channel": "",
            "device": r["device"],
            "prior_eshop_user": "",
            "session_date": date,
            "session_time": time,
            "consent_signed": "TRUE",
            "task_success": norm_success(r["success"]),
            "time_seconds": parse_time(r["time"]),
            "help_count": r["help"] if re.fullmatch(r"\d+", r["help"] or "") else "",
            "sus_score": score,
            "valid_session": "TRUE" if valid else "FALSE",
            "notes": note,
        })
        s = {"participant": r["pid"]}
        for i in range(10):
            s[f"q{i + 1}"] = r["sus"][i] if len(r["sus"]) == 10 else ""
        s["valid_session"] = "TRUE" if (valid and score != "") else "FALSE"
        s["note"] = note
        s_rows.append(s)

    # Bảng tóm tắt
    print(f"\n{'Phiên':<6}{'Tuổi':<7}{'Kết quả':<10}{'Thời gian':<11}{'SUS':>6}  Quote")
    for r, p in zip(rows, p_rows):
        t = p["time_seconds"]
        t_txt = f"{t // 60}:{t % 60:02d}" if isinstance(t, int) else "—"
        print(f"{r['pid']:<6}{r['age'] or '—':<7}{p['task_success'] or '—':<10}{t_txt:<11}{p['sus_score'] or '—':>6}  {p['notes'][:40]}")

    scores = [p["sus_score"] for p in p_rows if p["sus_score"] != ""]
    n_valid = sum(1 for p in p_rows if p["valid_session"] == "TRUE")
    print(f"\nn = {len(p_rows)} dòng · hợp lệ = {n_valid} · SUS có dữ liệu = {len(scores)}")
    if scores:
        mean = round(statistics.mean(scores), 1)
        sd = round(statistics.stdev(scores), 1) if len(scores) > 1 else 0.0
        print(f"SUS mean = {mean} · median = {statistics.median(scores)} · SD = {sd}")

    if len(p_rows) < 7:
        print(f"Lưu ý: mới có {len(p_rows)}/7 phiên — báo cáo sẽ ghi đúng n này và phần hạn chế.")

    if args.dry_run:
        print("\n[dry-run] chưa ghi file.")
        return 0

    with open(P_CSV, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=P_HEADER)
        w.writeheader()
        w.writerows(p_rows)
    with open(S_CSV, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=S_HEADER)
        w.writeheader()
        w.writerows(s_rows)
    print(f"\nĐã ghi {P_CSV}")
    print(f"Đã ghi {S_CSV}")
    print("Bước tiếp: python scripts/sus_score.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
