"""gform_to_csv.py — Chuyển CSV tải từ Google Form (Responses → CSV) thành
usability/participants.csv + usability/sus_scores.csv.

Yêu cầu form dựng theo usability/GOOGLE_FORM_GUIDE.md — đặc biệt:
    cột "Mã phiên P? (người mời bạn cung cấp, ví dụ P1)"
    cột "SUS Q1" … "SUS Q10"
Script map cột theo từ khoá trong tiêu đề, nên chấp nhận đổi wording nhẹ.

Chạy:
    python scripts/gform_to_csv.py --dry-run
    python scripts/gform_to_csv.py [--input usability/gform_responses.csv]
"""
import argparse
import csv
import os
import re
import statistics
import sys
import unicodedata

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sus_from_lines import (  # noqa: E402
    P_HEADER, S_HEADER, ROOT as _ROOT, SRC as LINES_SRC,
    age_range, mask_contact, parse_time, parse_sus, sus_score, norm_success, split_when,
)

P_CSV = os.path.join(ROOT, "usability", "participants.csv")
S_CSV = os.path.join(ROOT, "usability", "sus_scores.csv")
DEFAULT_IN = os.path.join(ROOT, "usability", "gform_responses.csv")


def deaccent(s):
    """Bỏ dấu tiếng Việt để map cột bền vững với encoding."""
    nfkd = unicodedata.normalize("NFD", s or "")
    return "".join(ch for ch in nfkd if not unicodedata.combining(ch))


def find_col(headers, *keywords):
    """Tìm cột đầu tiên có tất cả keywords (bỏ dấu, không phân biệt hoa thường)."""
    ks = [deaccent(k).lower() for k in keywords]
    for h in headers:
        hl = deaccent(h).lower()
        if all(k in hl for k in ks):
            return h
    return None


def find_sus_cols(headers):
    out = {}
    for h in headers:
        m = re.search(r"sus\s*q\s*(10|[1-9])(?!\d)", deaccent(h).lower())
        if m:
            out[int(m.group(1))] = h
    return out


def pick(row, col):
    if col is None:
        return ""
    return (row.get(col) or "").strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=DEFAULT_IN)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(args.input):
        print(f"Chưa có file responses: {args.input}")
        print("Tải CSV: Google Form → Responses → Sheets → File → Download → CSV")
        return 1

    with open(args.input, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        print("File CSV rỗng — chưa có response nào.")
        return 1

    headers = list(rows[0].keys())
    c_pid = find_col(headers, "mã phiên") or find_col(headers, "ma phien") or find_col(headers, "p?")
    c_name = (find_col(headers, "họ tên") or find_col(headers, "ho ten")
              or find_col(headers, "biệt danh") or find_col(headers, "biet danh")
              or find_col(headers, "tên của bạn") or find_col(headers, "ten cua ban"))
    c_age = find_col(headers, "tuổi") or find_col(headers, "tuoi")
    c_job = find_col(headers, "nghề nghiệp") or find_col(headers, "nghe nghiep")
    c_contact = find_col(headers, "liên hệ") or find_col(headers, "lien he") or find_col(headers, "sđt") or find_col(headers, "sdt")
    c_when = find_col(headers, "thời điểm") or find_col(headers, "thoi diem")
    c_device = find_col(headers, "thiết bị") or find_col(headers, "thiet bi")
    c_freq = find_col(headers, "mua hàng online") or find_col(headers, "mua hang online")
    c_success = find_col(headers, "hoàn thành", "thế nào") or find_col(headers, "hoan thanh", "the nao")
    c_time = find_col(headers, "tổng thời gian") or find_col(headers, "tong thoi gian")
    c_help = find_col(headers, "gợi ý mấy lần") or find_col(headers, "goi y may lan")
    c_coupon = find_col(headers, "save10")
    c_trust = find_col(headers, "tin đơn") or find_col(headers, "tin don")
    c_confuse = find_col(headers, "rối nhất") or find_col(headers, "roi nhat")
    c_slow = find_col(headers, "chậm nhất") or find_col(headers, "cham nhat")
    c_fix = find_col(headers, "sửa 1 thứ") or find_col(headers, "sua 1 thu") or find_col(headers, "thay đổi") or find_col(headers, "thay doi")
    c_quote = find_col(headers, "một câu bạn đã nói") or find_col(headers, "mot cau ban da noi")
    sus_cols = find_sus_cols(headers)

    missing = [name for name, c in {
        "Tuổi": c_age, "Kết quả task": c_success,
    }.items() if c is None]
    if len(sus_cols) != 10:
        missing.append(f"SUS Q1..Q10 (thấy {len(sus_cols)}/10)")
    if missing:
        print("  ! Không tìm thấy cột:", ", ".join(missing))
        print("    → kiểm tra tên câu hỏi theo usability/GOOGLE_FORM_GUIDE.md")
    if c_pid is None:
        print("  i Không có cột 'Mã phiên' → đánh P1…P7 theo thứ tự response (đối chiếu bằng tên/SĐT).")

    p_rows, s_rows = [], []
    for i, r in enumerate(rows, start=1):
        pid = pick(r, c_pid) or f"P{i}"
        name_raw = pick(r, c_name)
        name_masked = (name_raw[0] + "**") if name_raw else ""
        success_raw = deaccent(pick(r, c_success)).lower()
        success = norm_success("Success" if ("tu lam xong" in success_raw or "khong can goi y" in success_raw)
                               else "Help" if ("goi y" in success_raw or "can duoc goi y" in success_raw)
                               else "Failure" if ("khong hoan thanh" in success_raw) else "")
        when = pick(r, c_when)
        date, time = split_when(when)
        contact = pick(r, c_contact)
        help_raw = pick(r, c_help)
        help_n = help_raw.split()[0] if re.match(r"\d", help_raw) else ""
        answers = []
        for q in range(1, 11):
            col = sus_cols.get(q)
            v = pick(r, col)
            m = re.match(r"^\s*([1-5])", v)
            answers.append(int(m.group(1)) if m else None)
        sus_ok = all(a is not None for a in answers)
        notes = " | ".join(x for x in [
            f"Ten: {name_masked}" if name_masked else "",
            f"Coupon: {pick(r, c_coupon)}" if c_coupon else "",
            f"Trust: {pick(r, c_trust)}" if c_trust else "",
            f"Rối nhất: {pick(r, c_confuse)}" if c_confuse else "",
            f"Chậm nhất: {pick(r, c_slow)}" if c_slow else "",
            f"Muốn sửa: {pick(r, c_fix)}" if c_fix else "",
            f'Quote: {pick(r, c_quote)}' if c_quote else "",
        ] if x)
        score = sus_score(answers) if sus_ok else ""
        p_rows.append({
            "participant_id": pid,
            "age_range": age_range(pick(r, c_age)),
            "occupation": pick(r, c_job),
            "contact_masked": mask_contact(contact),
            "contact_full_local_only": contact,
            "recruit_channel": "gform",
            "device": pick(r, c_device),
            "prior_eshop_user": pick(r, c_freq),
            "session_date": date,
            "session_time": time,
            "consent_signed": "TRUE",
            "task_success": success,
            "time_seconds": parse_time(pick(r, c_time)),
            "help_count": help_n,
            "sus_score": score,
            "valid_session": "TRUE" if success else "FALSE",
            "notes": notes,
        })
        s = {"participant": pid}
        for q in range(1, 11):
            s[f"q{q}"] = answers[q - 1] if (sus_ok and answers[q - 1] is not None) else ""
        s["valid_session"] = "TRUE" if (success and sus_ok) else "FALSE"
        s["note"] = pick(r, c_quote)
        s_rows.append(s)

    print(f"\n{'Phiên':<6}{'Tên':<6}{'Tuổi':<7}{'Kết quả':<10}{'Thời gian':<11}{'SUS':>6}  SĐT che / Thiết bị")
    for r, p in zip(rows, p_rows):
        t = p["time_seconds"]
        t_txt = f"{t // 60}:{t % 60:02d}" if isinstance(t, int) else "—"
        nm = p["notes"].split("Ten: ")[1].split(" | ")[0] if "Ten: " in p["notes"] else "—"
        print(f"{p['participant_id']:<6}{nm:<6}{r.get(c_age, '') or '—':<7}{p['task_success'] or '—':<10}"
              f"{t_txt:<11}{p['sus_score'] or '—':>6}  {p['contact_masked']} / {p['device'][:24]}")

    scores = [p["sus_score"] for p in p_rows if p["sus_score"] != ""]
    n_valid = sum(1 for p in p_rows if p["valid_session"] == "TRUE")
    print(f"\nn = {len(p_rows)} response · hợp lệ = {n_valid} · SUS có dữ liệu = {len(scores)}")
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
