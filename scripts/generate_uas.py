#!/usr/bin/env python3
"""Generate quiz-uas.js (100 questions) from parsed chapter JSONs."""
import json
import os

BASE = r"C:\Documents\Desktop\Project\project\anovlatsol\soal_latihan\extracted"
OUT = r"C:\Documents\Desktop\Project\project\anovlatsol\src\data\psd\quiz-uas.js"

BAB_TITLES = {
    8: "Regresi Nonlinear",
    9: "Pengenalan Machine Learning",
    10: "Supervised dan Unsupervised Learning",
    11: "Shrinkage Methods",
    12: "Data Storytelling dan Dashboarding",
}


def escape_js(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").replace("\r", " ")


def main():
    all_qs = {}
    for bab in range(8, 13):
        with open(os.path.join(BASE, f"bab{bab}.json"), "r", encoding="utf-8") as f:
            all_qs[bab] = json.load(f)

    # Pick first 20 from each BAB (50 x 5 distribution would exceed 100, so 20 x 5 = 100)
    selected = []
    for bab in range(8, 13):
        for q in all_qs[bab][:20]:
            selected.append({
                "bab": bab,
                "babTitle": BAB_TITLES[bab],
                "question": q["question"],
                "options": q["options"],
                "answer": q["answer"],
                "explanation": q["explanation"],
            })

    lines = ["// Bank Soal UAS - Campuran Semua BAB 8-12 (100 soal)", "export const quizUAS = ["]
    for idx, q in enumerate(selected, 1):
        qid = f"psd-uas-{idx:03d}"
        opts = []
        for opt_id in sorted(q["options"].keys()):
            text = escape_js(q["options"][opt_id])
            opts.append(f"      {{ id: '{opt_id}', text: '{text}' }}")
        opts_str = ",\n".join(opts)
        question_text = escape_js(q["question"])
        explanation_text = escape_js(q["explanation"])
        lines.append(f"  {{")
        lines.append(f"    id: \"{qid}\",")
        lines.append(f"    type: 'multiple_choice',")
        lines.append(f"    bab: {q['bab']},")
        lines.append(f"    babTitle: '{q['babTitle']}',")
        lines.append(f"    question: '{question_text}',")
        lines.append(f"    options: [")
        lines.append(opts_str)
        lines.append(f"    ],")
        lines.append(f"    correctAnswer: \"{q['answer']}\",")
        lines.append(f"    explanation: '{explanation_text}',")
        lines.append(f"    difficulty: 'medium',")
        lines.append(f"    tags: [\"pilihan-ganda\", \"uas\"],")
        lines.append(f"  }},")
    lines.append("];\n")
    lines.append("// Return a fresh copy of UAS questions")
    lines.append("export function getUASQuestions() {")
    lines.append("  return [...quizUAS];")
    lines.append("}")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {OUT} with {len(selected)} questions")


if __name__ == "__main__":
    main()
