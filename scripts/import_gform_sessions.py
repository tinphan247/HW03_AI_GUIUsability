"""import_gform_sessions.py — biến CSV Google Form thành hồ sơ từng phiên.

Đọc  usability/gform_responses_dedup.csv  (đã bỏ response trùng)
Ghi:
    usability/participants.csv        (giữ nguyên điểm SUS, che SĐT)
    usability/contacts_local.csv      (họ tên + SĐT đầy đủ - KHÔNG nộp kèm)
    usability/sessions/P1..P7/notes.md

Chạy sau khi đã chạy gform_to_csv.py + sus_score.py:
    python scripts/import_gform_sessions.py
"""
import csv
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "usability", "gform_responses_dedup.csv")
P_CSV = os.path.join(ROOT, "usability", "participants.csv")
LOCAL = os.path.join(ROOT, "usability", "contacts_local.csv")
SESS = os.path.join(ROOT, "usability", "sessions")

Q = {  # map theo thứ tự câu SUS trong form
    1: "Q1", 2: "Q2", 3: "Q3", 4: "Q4", 5: "Q5",
    6: "Q6", 7: "Q7", 8: "Q8", 9: "Q9", 10: "Q10",
}


def mask_name(name):
    name = (name or "").strip()
    return (name[0] + "**") if name else "—"


def main():
    rows = list(csv.DictReader(open(SRC, encoding="utf-8-sig", newline="")))
    sus = {r["participant"]: r for r in csv.DictReader(open(os.path.join(ROOT, "usability", "sus_scores.csv"),
                                                           encoding="utf-8-sig", newline=""))}
    for i, r in enumerate(rows, start=1):
        pid = f"P{i}"
        name = r.get("Họ và tên", "")
        phone = r.get("Số điện thoại hoặc Zalo liên hệ: (Dùng để Trợ giảng xác minh ngẫu nhiên bạn có tham gia test thật, sẽ được che 4 số giữa trong báo cáo nộp)", "")
        age = r.get("Tuổi của bạn", "")
        task = r.get("Bạn hoàn thành tác vụ (tạo tài khoản → mua điện thoại → áp mã SAVE10 → thanh toán → xem lại đơn) thế nào?", "")
        want = r.get("Điều bạn muốn thay đổi nhất trên trang này là gì? (không bắt buộc)", "")
        ts = r.get("Dấu thời gian", "")
        s = sus.get(pid, {})
        answers = " · ".join(f"{Q[q]}={s.get('q%d' % q, '')}" for q in range(1, 11))
        body = f"""# Phiên {pid} — notes (từ Google Form)

**Người tham gia:** {pid} (tên đầy đủ trong `usability/contacts_local.csv` — không nộp kèm)
**Tuổi:** {age}  **Hình thức:** online, không moderator trực tiếp
**Thời điểm gửi form:** {ts}
**Thiết bị:** không thu thập (form 1 phút không có câu thiết bị)

## Kết quả tự báo cáo

- **Task outcome:** {task}
- **Thời gian:** không đo (form không có câu thời gian) → `khong-do`
- **Số lần trợ giúp:** tự báo cáo trong câu task outcome
- **Điều muốn thay đổi nhất:** {want or "(bỏ trống)"}

## SUS

- **Điểm:** {s.get('sus_score', '—')}
- **Câu trả lời:** {answers}

## Hạn chế của phiên này

Không có observe trực tiếp, không có quote nói-to-suy-nghĩ, không có timeline từng bước.
Dữ liệu chỉ gồm những gì người tham gia tự khai trong form.
"""
        d = os.path.join(SESS, pid)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "notes.md"), "w", encoding="utf-8").write(body)

    # contacts local (không nộp kèm)
    with open(LOCAL, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["participant_id", "full_name", "phone_or_zalo"])
        for i, r in enumerate(rows, start=1):
            w.writerow([f"P{i}",
                        r.get("Họ và tên", ""),
                        r.get("Số điện thoại hoặc Zalo liên hệ: (Dùng để Trợ giảng xác minh ngẫu nhiên bạn có tham gia test thật, sẽ được che 4 số giữa trong báo cáo nộp)", "")])
    print(f"contacts_local.csv: {len(rows)} dòng (không đưa vào zip)")

    # participants.csv bản nộp: xoá SĐT đầy đủ, chỉ giữ bản che
    if os.path.exists(P_CSV):
        prows = list(csv.DictReader(open(P_CSV, encoding="utf-8-sig", newline="")))
        for p in prows:
            p["contact_full_local_only"] = ""
        with open(P_CSV, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(prows[0].keys()))
            w.writeheader()
            w.writerows(prows)
        print("participants.csv: đã xoá SĐT đầy đủ (giữ bản che 4 số giữa)")
    print(f"sessions: đã ghi {len(rows)} thư mục notes.md")


if __name__ == "__main__":
    raise SystemExit(main())
