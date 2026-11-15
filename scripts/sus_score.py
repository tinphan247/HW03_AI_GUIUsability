"""sus_score.py — Tính điểm SUS từ usability/sus_scores.csv.

CSV cột: participant,q1..q10 (giá trị 1..5). Chỉ tính các dòng có đủ 10 câu
và valid_session == TRUE nếu có cột đó.

Chạy: python scripts/sus_score.py
Output:
    usability/sus_results.md   — bảng điểm + mean/SD + diễn giải
    usability/sus_scores_filled.csv — bản có điểm từng người
"""
import csv
import os
import statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "usability", "sus_scores.csv")
OUT = os.path.join(ROOT, "usability", "sus_results.md")
FILLED = os.path.join(ROOT, "usability", "sus_scores_filled.csv")


def interpret(score):
    if score < 51:
        return "Poor"
    if score <= 67:
        return "OK"
    if score <= 80:
        return "Good"
    return "Excellent"


def main():
    if not os.path.exists(SRC):
        print(f"Missing {SRC}. Tạo file với header: participant,q1,...,q10,valid_session")
        return
    rows = []
    with open(SRC, encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            pid = (r.get("participant") or "").strip()
            if not pid:
                continue
            try:
                ans = [int(r[f"q{i}"]) for i in range(1, 11)]
            except (KeyError, ValueError, TypeError):
                continue
            if any(a < 1 or a > 5 for a in ans):
                print(f"Skip {pid}: giá trị ngoài 1..5")
                continue
            valid = (r.get("valid_session") or "TRUE").strip().upper() != "FALSE"
            if not valid:
                print(f"Skip {pid}: valid_session=FALSE")
                continue
            odd = sum(a - 1 for a in ans[0::2])
            even = sum(5 - a for a in ans[1::2])
            sus = (odd + even) * 2.5
            rows.append({"pid": pid, "ans": ans, "sus": sus, "note": r.get("note", "")})

    if not rows:
        print("Không có dòng hợp lệ.")
        return

    scores = [x["sus"] for x in rows]
    mean = statistics.mean(scores)
    sd = statistics.stdev(scores) if len(scores) > 1 else 0.0

    os.makedirs(os.path.dirname(FILLED), exist_ok=True)
    with open(FILLED, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["participant", *[f"q{i}" for i in range(1, 11)], "sus_score", "grade"])
        for x in rows:
            w.writerow([x["pid"], *x["ans"], f"{x['sus']:.1f}", interpret(x["sus"])])

    lines = [
        "# Kết quả SUS",
        "",
        f"Số phiên hợp lệ: **{len(rows)}**",
        "",
        "| Participant | " + " | ".join(f"Q{i}" for i in range(1, 11)) + " | SUS | Mức |",
        "| :--- | " + " | ".join(":-:" for _ in range(10)) + " | ---: | :--- |",
    ]
    for x in rows:
        lines.append(
            f"| {x['pid']} | " + " | ".join(str(a) for a in x["ans"]) + f" | {x['sus']:.1f} | {interpret(x['sus'])} |"
        )
    lines += [
        "",
        "## Tổng hợp",
        "",
        "| Metric | Value |",
        "| :--- | ---: |",
        f"| Mean SUS | **{mean:.1f}** |",
        f"| Median | {statistics.median(scores):.1f} |",
        f"| SD | {sd:.1f} |",
        f"| Min – Max | {min(scores):.1f} – {max(scores):.1f} |",
        f"| Diễn giải | **{interpret(mean)}** (theo thang <51 poor · 51–67 OK · 68–80 good · >80 excellent) |",
        "",
        "> Với n = 7, đây là dữ liệu mô tả, không đủ để suy rộng thống kê. Kết hợp với quan sát định tính và probe.",
    ]
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Wrote {OUT} — n={len(rows)}, mean={mean:.1f}, SD={sd:.1f}")


if __name__ == "__main__":
    main()
