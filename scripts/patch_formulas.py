#!/usr/bin/env python3
"""
Patch missing formula placeholders in question JSON files.
PDF text extraction dropped math symbols; this script fills the most common
and critical placeholders with sensible LaTeX/text replacements.
"""
import json
import os
import re

BASE = r"C:\Documents\Desktop\Project\project\anovlatsol\soal_latihan\extracted"
OUT = r"C:\Documents\Desktop\Project\project\anovlatsol\src\data\psd"

BAB_TITLES = {
    8: "Regresi Nonlinear",
    9: "Pengenalan Machine Learning",
    10: "Supervised dan Unsupervised Learning",
    11: "Shrinkage Methods",
    12: "Data Storytelling dan Dashboarding",
}


def patch_text(text, bab, qnum, field):
    """Apply context-aware replacements to a text string."""
    t = text

    # --- Explicit ( ) placeholders with specific context ---
    replacements = [
        (r"derajat \( \)", r"derajat $d$"),
        (r"derajat \(\)", r"derajat $d$"),
        (r"Koefisien Determinasi \( \)", r"Koefisien Determinasi ($R^2$)"),
        (r"Koefisien Determinasi \(\)", r"Koefisien Determinasi ($R^2$)"),
        (r"Coefficient of Determination \( \)", r"Coefficient of Determination ($R^2$)"),
        (r"Coefficient of Determination \(\)", r"Coefficient of Determination ($R^2$)"),
        (r"R-squared \( \)", r"R-squared ($R^2$)"),
        (r"R-squared \(\)", r"R-squared ($R^2$)"),
        (r"variabel target \( \)", r"variabel target ($y$)"),
        (r"target \( \)", r"target ($y$)"),
        (r"hasil panen \( \)", r"hasil panen ($y$)"),
        (r"jumlah pupuk \( \)", r"jumlah pupuk ($x_1$)"),
        (r"curah hujan \( \)", r"curah hujan ($x_2$)"),
        (r"luas lahan \( \)", r"luas lahan ($x_3$)"),
        (r"suhu \( \)", r"suhu ($x_4$)"),
        (r"fitur kuadrat \( \)", r"fitur kuadrat ($x^2$)"),
        (r"fitur kubik \( \)", r"fitur kubik ($x^3$)"),
        (r"fitur baru \( \)", r"fitur baru ($\\phi(x)$)"),
        (r"koefisien regresi optimal \( \)", r"koefisien regresi optimal ($\\hat{\\beta}$)"),
        (r"bobot \( \)", r"bobot ($\\beta_j$)"),
        (r"parameter \( \)", r"parameter ($\\theta$)"),
        (r"parameter estimasi \( \)", r"parameter estimasi ($\\beta$)"),
        (r"parameter koefisiennya \( \)", r"parameter koefisiennya ($\\beta_j$)"),
        (r"parameter penyusutan bias \( \)", r"parameter penyusutan bias ($\\lambda$)"),
        (r"jumlah cluster \( \)", r"jumlah cluster ($K$)"),
        (r"Lambda \( \)", r"Lambda ($\\lambda$)"),
        (r"lambda \( \)", r"lambda ($\\lambda$)"),
        (r"simbol \( \)", r"simbol $\\lambda$"),
        (r"pusat-pusat lokal \( \)", r"pusat-pusat lokal ($\\mu_j$)"),
        (r"data masukan \( \)", r"data masukan ($X$)"),
        (r"label target atau \"kebenaran\" \( \)", r"label target atau \"kebenaran\" ($y$)"),
        (r"label target aktual \( \)", r"label target aktual ($y_i$)"),
        (r"produktivitas hasil panen per hektar \( \)", r"produktivitas hasil panen per hektar ($y$)"),
        (r"nilai MSE yang diperoleh dari Soal 34 \( \)", r"nilai MSE yang diperoleh dari Soal 34 ($MSE$)"),
        (r"hasil prediksinya \( \)", r"hasil prediksinya ($\\hat{y}$)"),
        (r"jarak ke cluster tetangga \( \)", r"jarak ke cluster tetangga ($b_i$)"),
        (r"jarak intra-cluster \( \)", r"jarak intra-cluster ($a_i$)"),
        (r"suhu optimalnya \( \)", r"suhu optimalnya ($x_{opt}$)"),
        (r"kadar gula darah adalah Normal \( \), Borderline \( \), dan Tinggi/Diabetes \( \)",
         r"kadar gula darah adalah Normal (<100), Borderline (100-125), dan Tinggi/Diabetes (>=126)"),
        (r"Normal \( \), Borderline \( \), Tinggi \( \)",
         r"Normal (< 100 mg/dL), Borderline (100-125 mg/dL), Tinggi (>= 126 mg/dL)"),
        (r"dengan parameternya \( \)", r"dengan parameternya ($\\beta$)"),
        (r"variabel input \( \)", r"variabel input ($x$)"),
        (r"jumlah fungsi basis \( \)", r"jumlah fungsi basis ($J$)"),
        (r"Nilai transformasi basis RBF ke- yang dievaluasi pada data sampel ke- \( \)\.",
         r"Nilai transformasi basis RBF ke-$j$ yang dievaluasi pada data sampel ke-$i$ ($z_{ij}$)."),
        (r"jumlah pusat basis harus selalu sama persis dengan jumlah sampel data latih \( \)\.",
         r"jumlah pusat basis harus selalu sama persis dengan jumlah sampel data latih ($N$)."),
    ]
    for pattern, repl in replacements:
        t = re.sub(pattern, repl, t)

    # Generic ( ) cleanup: if still any ( ) left, replace with empty or a note
    # based on preceding word. Use a fallback to avoid leaving ugly placeholders.
    def fallback_replace(match):
        # Find the word before the placeholder
        before = t[:match.start()].strip()
        # get last word
        last_word = before.split()[-1] if before else ""
        formula_map = {
            "derajat": "$d$",
            "target": "$y$",
            "masukan": "$X$",
            "kebenaran": "$y$",
            "aktual": "$y$",
            "label": "$y$",
            "prediksi": "$\\hat{y}$",
            "koefisien": "$\\beta$",
            "parameter": "$\\theta$",
            "pupuk": "$x_1$",
            "panen": "$y$",
            "hujan": "$x_2$",
            "lahan": "$x_3$",
            "suhu": "$x_4$",
            "cluster": "$K$",
            "basis": "$J$",
            "lambda": "$\\lambda$",
            "Lambda": "$\\lambda$",
            "determinasi": "$R^2$",
            "Determination": "$R^2$",
            "R-squared": "$R^2$",
            "optimalnya": "$x_{opt}$",
            "hektar": "$y$",
            "tetangga": "$b_i$",
            "intra-cluster": "$a_i$",
            "lokal": "$\\mu_j$",
            "Tinggi": "",
            "Borderline": "",
            "Normal": "",
        }
        if last_word in formula_map:
            return formula_map[last_word]
        # If we can't infer, just remove the placeholder
        return ""

    # Only replace standalone ( ) that are left
    t = re.sub(r"\( \)", fallback_replace, t)
    # Clean up double spaces left behind
    t = re.sub(r"  +", " ", t)

    # Blood sugar categories (BAB8 Q19) - explicit fallback
    if bab == 8 and qnum == 19:
        t = t.replace(
            "Normal (< 100 mg/dL), Borderline (100-125 mg/dL), Tinggi (>= 126 mg/dL).",
            "Normal (< 100 mg/dL), Borderline (100-125 mg/dL), Tinggi/Diabetes (>= 126 mg/dL).",
        )

    # --- Missing formulas without explicit placeholder ---
    # BAB8
    if bab == 8:
        if "regresi basis function ," in t:
            t = t.replace("regresi basis function ,", "regresi basis function $y(x) = \\sum_j \\beta_j \\phi_j(x)$,")
        if "peran ?" in t:
            t = t.replace("peran ?", "peran $\\phi_j(x)$?")
        if "Regresi Polynomial ," in t:
            t = t.replace("Regresi Polynomial ,", "Regresi Polynomial $\\hat{y}(x) = \\beta_0 + \\beta_1 x + \\beta_2 x^2 + \\cdots + \\beta_d x^d$,")
        if "nilai ?" in t:
            t = t.replace("nilai ?", "nilai $d$?")
        if "derajat ," in t:
            t = t.replace("derajat ,", "derajat $d$,")
        if "rumus Gaussian RBF ," in t:
            t = t.replace("rumus Gaussian RBF ,", "rumus Gaussian RBF $\\phi_j(x) = \\exp(-\\gamma |x - \\mu_j|^2)$,")
        if "variabel ?" in t:
            t = t.replace("variabel ?", "variabel $\\gamma$?")
        if "jarak ." in t:
            t = t.replace("jarak .", "jarak $|x - \\mu_j|$.")
        if "matriks desain fitur RBF ," in t:
            t = t.replace("matriks desain fitur RBF ,", "matriks desain fitur RBF $Z$,")
        if "baris ke- dan kolom ke-" in t:
            t = t.replace("baris ke- dan kolom ke-", "baris ke-$i$ dan kolom ke-$j$")
        if "transformasi basis ," in t:
            t = t.replace("transformasi basis ,", "transformasi basis $\\phi_j(x)$,")
        if "sampel data ." in t:
            t = t.replace("sampel data .", "sampel data $x_i$.")
        if "titik potong ." in t:
            t = t.replace("titik potong .", "titik potong $\\xi_k$.")
        if "fungsi indikator ," in t:
            t = t.replace("fungsi indikator ,", "fungsi indikator $I(x \\in A_k)$,")
        if "sampel data ," in t:
            t = t.replace("sampel data ,", "sampel data $x_i$,")
        if "fitur baru ," in t:
            t = t.replace("fitur baru ,", "fitur baru $\\phi(x)$,")
        if "Semakin besar ," in t:
            t = t.replace("Semakin besar ,", "Semakin besar $\\gamma$,")
        if "fungsi basis ," in t:
            t = t.replace("fungsi basis ,", "fungsi basis $\\phi_j(x)$,")

    # BAB9
    if bab == 9:
        if "nilai aktual dan nilai prediksi ," in t:
            t = t.replace("nilai aktual dan nilai prediksi ,", "nilai aktual $y_i$ dan nilai prediksi $\\hat{y}_i$,")
        if "jumlah sampel ," in t:
            t = t.replace("jumlah sampel ,", "jumlah sampel $n$,")
        if "selisih ," in t:
            t = t.replace("selisih ,", "selisih $(y_i - \\hat{y}_i)$,")
        if re.search(r": Hasil panen \( \) ; : Jenis pupuk", t):
            t = re.sub(r"(: Hasil panen \( \) ; : Jenis pupuk)", r"$y$: Hasil panen ($y$) ; $X$: Jenis pupuk", t)
        if re.search(r": Curah hujan.*?; : Hasil panen \( \)", t):
            t = re.sub(r"(: Curah hujan.*?) ; (: Hasil panen \( \))", r"$X$: Curah hujan, suhu, kelembaban tanah, pupuk ; $y$: Hasil panen ($y$)", t)

    # BAB10
    if bab == 10:
        if "data masukan ( )" in t:
            t = t.replace("data masukan ( )", "data masukan ($X$)")
        if "kebenaran ( )" in t:
            t = t.replace("kebenaran ( )", "kebenaran ($y$)")
        if "target ( )" in t:
            t = t.replace("target ( )", "target ($y$)")
        if "produktivitas padi (hasil panen dalam satuan )." in t:
            t = t.replace("produktivitas padi (hasil panen dalam satuan ).", "produktivitas padi (hasil panen dalam satuan ton/ha).")
        if "Nilai berada dalam rentang interval ," in t:
            t = t.replace("Nilai berada dalam rentang interval ,", "Nilai $x$ berada dalam rentang interval,")
        if "Nilai berada dalam interval ," in t:
            t = t.replace("Nilai berada dalam interval ,", "Nilai $x$ berada dalam interval,")
        if "pasangan , maka adalah" in t:
            t = t.replace("pasangan , maka adalah", "pasangan $(X, y)$, maka $y$ adalah")
        if "mendekati nilai ," in t:
            t = t.replace("mendekati nilai ,", "mendekati nilai $-1$,")
        if "berada pada , di mana" in t:
            t = t.replace("berada pada , di mana", "berada pada $25^\\circ C$, di mana")
        if "nilai MAE bernilai dan rata-rata hasil panen aktual adalah" in t:
            t = t.replace("nilai MAE bernilai dan rata-rata hasil panen aktual adalah", "nilai MAE bernilai $a$ dan rata-rata hasil panen aktual adalah $\\bar{y}$")
        if "jumlah cluster ," in t:
            t = t.replace("jumlah cluster ,", "jumlah cluster $K=1$,")
        if "kesalahan prediksi yang besar (outlier)" in t and "selisih ," in t:
            t = t.replace("selisih ,", "selisih $(y_i - \\hat{y}_i)$,")

    # BAB11
    if bab == 11:
        if "fungsi objektif Ridge Regression ?" in t:
            t = t.replace("fungsi objektif Ridge Regression ?", "fungsi objektif Ridge Regression $\\text{SSE} + \\lambda \\sum \\beta_j^2$?")
        if "nilai parameter pada Ridge Regression diatur sangat besar ( )" in t:
            t = t.replace("nilai parameter pada Ridge Regression diatur sangat besar ( )", "nilai parameter $\\lambda$ pada Ridge Regression diatur sangat besar ($\\lambda \\to \\infty$)")
        if "Semakin besar ," in t:
            t = t.replace("Semakin besar ,", "Semakin besar $\\lambda$,")
        if "Jika ," in t:
            t = t.replace("Jika ,", "Jika $\\lambda = 0$,")
        if "membesar secara ekstrem" in t and "penalti ," in t:
            t = t.replace("penalti ,", "penalti $\\lambda \\sum \\beta_j^2$,")

    return t


def patch_questions(bab, questions):
    title = BAB_TITLES[bab]
    for q in questions:
        qnum = q.get("num", 0)
        q["bab"] = bab
        q["babTitle"] = title
        q["question"] = patch_text(q["question"], bab, qnum, "question")
        q["explanation"] = patch_text(q["explanation"], bab, qnum, "explanation")
        for opt_id in q.get("options", {}):
            q["options"][opt_id] = patch_text(q["options"][opt_id], bab, qnum, f"opt {opt_id}")
    return questions


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


def generate_uas(questions_by_bab):
    selected = []
    for bab in range(8, 13):
        selected.extend(questions_by_bab[bab][:20])
    import random
    random.seed(42)
    random.shuffle(selected)
    # Reassign IDs
    for idx, q in enumerate(selected, 1):
        q["id"] = f"psd-uas-{idx:03d}"
        q["tags"] = ["pilihan-ganda", "uas"]

    lines = ["// Bank Soal UAS: 100 soal (20 soal x 5 BAB)", "const uasQuestions = ["]
    for idx, q in enumerate(selected, 1):
        opts = []
        for opt_id in sorted(q["options"].keys()):
            text = escape_js(q["options"][opt_id])
            opts.append(f"      {{ id: '{opt_id}', text: '{text}' }}")
        opts_str = ",\n".join(opts)
        question_text = escape_js(q["question"])
        explanation_text = escape_js(q["explanation"])
        lines.append(f"  {{")
        lines.append(f"    id: 'psd-uas-{idx:03d}',")
        lines.append(f"    type: 'multiple_choice',")
        lines.append(f"    bab: {q['bab']},")
        lines.append(f"    babTitle: '{q['babTitle']}',")
        lines.append(f"    question: '{question_text}',")
        lines.append(f"    options: [")
        lines.append(opts_str)
        lines.append(f"    ],")
        lines.append(f"    correctAnswer: '{q['answer']}',")
        lines.append(f"    explanation: '{explanation_text}',")
        lines.append(f"    difficulty: 'medium',")
        lines.append(f"    tags: [\"pilihan-ganda\", \"uas\"],")
        lines.append(f"  }},")
    lines.append(f"];\n")
    lines.append(f"export const quizUAS = uasQuestions;")
    lines.append(f"")
    lines.append(f"// Return a fresh copy of UAS questions")
    lines.append(f"export function getUASQuestions() {{")
    lines.append(f"  return [...quizUAS];")
    lines.append(f"}}")
    lines.append(f"export default quizUAS;")
    return "\n".join(lines)


js_names = {
    8: "bab-8-nonlinear.js",
    9: "bab-9-ml-intro.js",
    10: "bab-10-ml-lanjut.js",
    11: "bab-11-shrinkage.js",
    12: "bab-12-storytelling.js",
}

if __name__ == "__main__":
    questions_by_bab = {}
    for bab in range(8, 13):
        json_path = os.path.join(BASE, f"bab{bab}.json")
        with open(json_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
        questions = patch_questions(bab, questions)
        questions_by_bab[bab] = questions

        # Save patched JSON
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        print(f"Patched JSON: {json_path}")

        # Regenerate BAB JS
        js_path = os.path.join(OUT, js_names[bab])
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(questions_to_js(bab, questions))
        print(f"Regenerated JS: {js_path}")

    # Regenerate UAS quiz
    uas_js = generate_uas(questions_by_bab)
    with open(os.path.join(OUT, "quiz-uas.js"), "w", encoding="utf-8") as f:
        f.write(uas_js)
    print("Regenerated quiz-uas.js")
