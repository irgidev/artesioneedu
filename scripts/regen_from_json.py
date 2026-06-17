import json
import os

BASE = r"C:\Documents\Desktop\Project\project\anovlatsol\soal_latihan\extracted"
OUT = r"C:\Documents\Desktop\Project\project\anovlatsol\src\data\psd"

BAB_TITLES = {
    8: "Regresi Nonlinear",
    9: "Pengenalan Machine Learning",
    10: "Supervised dan Unsupervised Learning",
    11: "Shrinkage Methods",
    12: "Data Storytelling dan Dashboarding",
}


def escape_js(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").replace("\r", " ")


def questions_to_js(bab, questions):
    title = BAB_TITLES[bab]
    lines = [f"// Bank Soal BAB {bab}: {title}", f"const bab{bab}Questions = ["]
    for idx, q in enumerate(questions, 1):
        qid = f"psd-{bab}-{idx:03d}"
        opts = []
        for opt_id in sorted(q["options"].keys()):
            text = escape_js(q["options"][opt_id])
            opts.append(f"      {{ id: '{opt_id}', text: '{text}' }}")
        opts_str = ",\n".join(opts)
        question_text = escape_js(q["question"])
        explanation_text = escape_js(q["explanation"])
        lines.append(f"  {{")
        lines.append(f"    id: '{qid}',")
        lines.append(f"    type: 'multiple_choice',")
        lines.append(f"    bab: {bab},")
        lines.append(f"    babTitle: '{title}',")
        lines.append(f"    question: '{question_text}',")
        lines.append(f"    options: [")
        lines.append(opts_str)
        lines.append(f"    ],")
        lines.append(f"    correctAnswer: '{q['answer']}',")
        lines.append(f"    explanation: '{explanation_text}',")
        lines.append(f"    difficulty: 'medium',")
        lines.append(f"    tags: ['pilihan-ganda', 'konsep'],")
        lines.append(f"  }},")
    lines.append(f"];\n")
    lines.append(f"export default bab{bab}Questions;")
    return "\n".join(lines)


js_names = {
    8: "bab-8-nonlinear.js",
    9: "bab-9-ml-intro.js",
    10: "bab-10-ml-lanjut.js",
    11: "bab-11-shrinkage.js",
    12: "bab-12-storytelling.js",
}

for bab in range(8, 13):
    with open(os.path.join(BASE, f"bab{bab}.json"), "r", encoding="utf-8") as f:
        questions = json.load(f)
    js_path = os.path.join(OUT, js_names[bab])
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(questions_to_js(bab, questions))
    print(f"regenerated {js_path}")
