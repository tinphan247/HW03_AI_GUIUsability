"""dedupe_responses.py — bỏ response trùng (cùng SĐT) trong CSV Google Form.

Quy tắc: giữ response **cuối** của mỗi SĐT (người tham gia thường gửi lại bản sửa),
ghi lại số dòng bị bỏ để báo cáo minh bạch.

Chạy:
    python scripts/dedupe_responses.py [--in usability/gform_responses.csv]
                                      [--out usability/gform_responses_dedup.csv]
"""
import argparse
import csv
import os
import re
import sys
import unicodedata

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def deaccent(s):
    nfkd = unicodedata.normalize("NFD", s or "")
    return "".join(ch for ch in nfkd if not unicodedata.combining(ch))


def find_col(headers, *keywords):
    ks = [deaccent(k).lower() for k in keywords]
    for h in headers:
        hl = deaccent(h).lower()
        if all(k in hl for k in ks):
            return h
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="src", default=os.path.join(ROOT, "usability", "gform_responses.csv"))
    ap.add_argument("--out", dest="dst", default=os.path.join(ROOT, "usability", "gform_responses_dedup.csv"))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with open(args.src, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        print("File rỗng.")
        return 1
    headers = list(rows[0].keys())
    c_phone = (find_col(headers, "điện thoại") or find_col(headers, "dien thoai")
               or find_col(headers, "liên hệ") or find_col(headers, "lien he"))
    c_name = (find_col(headers, "họ và tên") or find_col(headers, "ho va ten")
              or find_col(headers, "họ tên") or find_col(headers, "ho ten"))
    c_time = find_col(headers, "dấu thời gian") or find_col(headers, "dau thoi gian")
    if c_phone is None:
        print("! Không tìm thấy cột SĐT — không dedupe được.")
        return 1

    def digits(v):
        return re.sub(r"\D", "", v or "")

    kept = {}
    order = []
    dropped = []
    for i, r in enumerate(rows, start=1):
        key = digits(r.get(c_phone, "")) or (r.get(c_name, "") or "").strip().lower() or f"row{i}"
        if key in kept:
            dropped.append((i, kept[key][0], r.get(c_name, ""), r.get(c_time, "")))
            kept[key] = (i, r)  # giữ bản cuối
        else:
            kept[key] = (i, r)
            order.append(key)

    out_rows = [kept[k][1] for k in order]
    print(f"n = {len(rows)} response · người duy nhất = {len(out_rows)} · bỏ {len(dropped)} dòng trùng")
    for row_no, first_no, name, when in dropped:
        print(f"  - bỏ dòng {row_no} ({name}) trùng SĐT với dòng {first_no}; giữ bản gửi sau ({when})")
    if args.dry_run:
        print("[dry-run] chưa ghi file.")
        return 0
    with open(args.dst, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=headers)
        w.writeheader()
        w.writerows(out_rows)
    print(f"Đã ghi {args.dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
