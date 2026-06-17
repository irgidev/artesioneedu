#!/usr/bin/env python3
"""Manual patches for formula questions whose options were lost during PDF text extraction."""
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

PATCHES = {
    8: {
        7: {
            "question": "Jika kita menerapkan transformasi regresi polynomial derajat d=3 pada variabel tunggal x (tanpa menyertakan intercept/bias pada transformator), vektor fitur baru hasil transformasinya adalah...",
            "options": {
                "a": "(x, x^2, x^3)",
                "b": "(1, x, x^2)",
                "c": "(x^2, x^3, x^4)",
                "d": "(1, x, x^2, x^3)",
            },
            "answer": "a",
            "explanation": "Transformasi polynomial derajat 3 tanpa menyertakan bias menghasilkan vektor pangkat variabel dari 1 hingga 3, yaitu (x, x^2, x^3).",
        },
        8: {
            "question": "Pada matriks desain X_poly untuk polynomial derajat 5, baris pertama yang memuat transformasi dari data tunggal x_1 memiliki bentuk...",
            "options": {
                "a": "[x_1, x_1^2, x_1^3, x_1^4, x_1^5]",
                "b": "[1, x_1, x_1^2, x_1^3, x_1^4]",
                "c": "[x_1, 2x_1, 3x_1, 4x_1, 5x_1]",
                "d": "[x_1^5, x_1^4, x_1^3, x_1^2, x_1]",
            },
            "answer": "a",
            "explanation": "Kolom matriks desain X_poly disusun secara teratur berdasarkan peningkatan pangkat dari fitur x_1 (dari pangkat 1 sampai 5).",
        },
        20: {
            "question": "Jika rentang x dalam [0,1] dibagi menjadi 8 interval sama besar, dan kita memiliki data x=0.2, ke dalam bentuk representasi one-hot encoding manakah data tersebut diubah?",
            "options": {
                "a": "(0, 1, 0, 0, 0, 0, 0, 0)",
                "b": "(1, 0, 0, 0, 0, 0, 0, 0)",
                "c": "(0, 0, 1, 0, 0, 0, 0, 0)",
                "d": "(0, 1, 1, 0, 0, 0, 0, 0)",
            },
            "answer": "a",
            "explanation": "Lebar tiap interval adalah 1/8 = 0.125. Interval pertama A_1=[0,0.125), interval kedua A_2=[0.125,0.25). Karena x=0.2 berada di dalam interval kedua (A_2), maka representasi one-hot bernilai 1 pada indeks kedua: (0,1,0,0,0,0,0,0).",
        },
    },
    9: {
        11: {
            "question": "Formula model matematika yang memetakan fitur input x menuju prediksi target y diwakili oleh persamaan...",
            "options": {
                "a": "y = f(x) + epsilon (model non-parametrik bebas)",
                "b": "y_hat = beta_0 + beta_1*x_1 + beta_2*x_2 + ... + beta_p*x_p",
                "c": "Loss = (y_observed - y_predicted)^2 saja tanpa parameter",
                "d": "y = x_1 * x_2 * ... * x_p (model multiplikatif)",
            },
            "answer": "b",
            "explanation": "Formula pemetaan fitur x ke estimasi nilai prediksi y_hat direpresentasikan dengan persamaan linear y_hat = beta_0 + sum(beta_j * x_j).",
        },
        12: {
            "question": "Di bawah ini, manakah formula yang tepat untuk merepresentasikan nilai kesalahan (Loss/Error) prediksi pada tiap instansi data?",
            "options": {
                "a": "e_i = y_hat_i / y_i",
                "b": "e_i = y_i - y_hat_i",
                "c": "e_i = (y_i + y_hat_i) / 2",
                "d": "e_i = |beta_i|",
            },
            "answer": "b",
            "explanation": "Berdasarkan materi, nilai error didefinisikan sebagai selisih antara nilai target sebenarnya (y_i) dan nilai prediksi (y_hat_i), yaitu: e_i = y_i - y_hat_i.",
        },
        36: {
            "question": "Berdasarkan data dari Soal 33 (y_actual = [10, 12] ton/ha dan y_predict = [11.5, 10.5] ton/ha), hitunglah nilai persentase kesalahan prediksi atau Mean Absolute Percentage Error (MAPE)!",
            "options": {
                "a": "5%",
                "b": "10%",
                "c": "15%",
                "d": "20%",
            },
            "answer": "b",
            "explanation": "MAPE = (1/n) * sum(|y_i - y_hat_i| / |y_i|) * 100%. Untuk data tersebut: (|10-11.5|/10 + |12-10.5|/12)/2 * 100% = (0.15 + 0.125)/2 * 100% = 10% (dibulatkan sesuai pilihan jawaban).",
        },
    },
    10: {
        12: {
            "question": "Formula manakah di bawah ini yang merepresentasikan pembuatan fitur rasio efisiensi penggunaan pupuk per satuan luas lahan?",
            "options": {
                "a": "ratio = total_pupuk / luas_lahan",
                "b": "ratio = luas_lahan / total_pupuk",
                "c": "ratio = total_pupuk * luas_lahan",
                "d": "ratio = total_pupuk - luas_lahan",
            },
            "answer": "b",
            "explanation": "Efisiensi penggunaan pupuk diperoleh dengan membagi dosis total pupuk yang diberikan dengan luas lahan tanam (total_pupuk / luas_lahan).",
        },
        18: {
            "question": "Formula matematika untuk menghitung Root Mean Squared Error (RMSE) adalah...",
            "options": {
                "a": "RMSE = (1/n) * sum(|y_i - y_hat_i|)",
                "b": "RMSE = sqrt((1/n) * sum((y_i - y_hat_i)^2))",
                "c": "RMSE = (1/n) * sum((y_i - y_hat_i)^2)",
                "d": "RMSE = sum((y_i - y_hat_i)^2) / sum(y_i)",
            },
            "answer": "b",
            "explanation": "RMSE dihitung dengan menguadratkan selisih prediksi, merata-ratakannya, lalu menarik akar kuadratnya: RMSE = sqrt((1/n) * sum((y_i - y_hat_i)^2)).",
        },
        34: {
            "question": "Perhatikan baris kode pembuatan data sintetis berikut: rain_effect = -0.0009 * (rainfall - 180)^2 + 5.5. Berdasarkan persamaan tersebut, pada nilai curah hujan berapakah efek hujan (rain_effect) terhadap hasil panen bernilai maksimum?",
            "options": {
                "a": "160 mm",
                "b": "170 mm",
                "c": "180 mm",
                "d": "190 mm",
            },
            "answer": "c",
            "explanation": "Fungsi kuadrat mencapai nilai puncak (maksimum) ketika suku kuadratnya bernilai nol, yaitu saat rainfall = 180.",
        },
    },
    11: {
        9: {
            "question": "Manakah persamaan model OLS yang tepat untuk use case hasil panen padi sesuai dengan penjelasan materi?",
            "options": {
                "a": "yield = beta_0 / (beta_1*rainfall + ...)",
                "b": "yield = beta_0 + beta_1*rainfall + beta_2*humidity + ... + beta_p*fitur_p",
                "c": "yield = beta_0 * beta_1^rainfall",
                "d": "yield = max(rainfall, humidity, ...)",
            },
            "answer": "b",
            "explanation": "Model regresi linear OLS merupakan fungsi penjumlahan linear dari intersep ditambah dengan perkalian koefisien dengan masing-masing fitur.",
        },
        20: {
            "question": "Manakah persamaan fungsi objektif (loss function) yang benar untuk Ridge Regression?",
            "options": {
                "a": "SSE + lambda * sum(beta_j^2)",
                "b": "SSE + lambda * sum(|beta_j|)",
                "c": "SSE + lambda * [alpha*sum(|beta_j|) + (1-alpha)*sum(beta_j^2)]",
                "d": "SSE tanpa penalti",
            },
            "answer": "a",
            "explanation": "Fungsi objektif Ridge Regression menambahkan penalti kuadrat koefisien (lambda * sum(beta_j^2)) ke fungsi SSE milik OLS. Pilihan B adalah Lasso, C adalah Elastic Net, dan D adalah OLS.",
        },
        30: {
            "question": "Manakah persamaan fungsi objektif yang benar untuk Lasso Regression?",
            "options": {
                "a": "SSE + lambda * sum(beta_j^2)",
                "b": "SSE + lambda * sum(|beta_j|)",
                "c": "SSE + lambda * [alpha*sum(|beta_j|) + (1-alpha)*sum(beta_j^2)]",
                "d": "SSE tanpa penalti",
            },
            "answer": "b",
            "explanation": "Fungsi objektif Lasso Regression menambahkan penalti absolut koefisien (lambda * sum(|beta_j|)) ke dalam fungsi SSE OLS. Pilihan A adalah Ridge, C adalah Elastic Net, dan D adalah OLS.",
        },
        42: {
            "question": "Manakah formulasi matematika fungsi objektif yang benar untuk Elastic Net?",
            "options": {
                "a": "SSE + lambda * [alpha*sum(|beta_j|) + (1-alpha)*sum(beta_j^2)]",
                "b": "SSE + lambda * sum(beta_j^2)",
                "c": "SSE + lambda * sum(|beta_j|)",
                "d": "SSE tanpa penalti",
            },
            "answer": "a",
            "explanation": "Elastic Net menggabungkan SSE dari OLS dengan dua penalti tambahan secara terpisah: penalti L1 (dikalikan alpha) dan penalti L2 (dikalikan 1-alpha).",
        },
    },
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
        lines.append(f"    id: \"{qid}\",")
        lines.append(f"    type: 'multiple_choice',")
        lines.append(f"    bab: {bab},")
        lines.append(f"    babTitle: '{title}',")
        lines.append(f"    question: '{question_text}',")
        lines.append(f"    options: [")
        lines.append(opts_str)
        lines.append(f"    ],")
        lines.append(f"    correctAnswer: \"{q['answer']}\",")
        lines.append(f"    explanation: '{explanation_text}',")
        lines.append(f"    difficulty: 'medium',")
        lines.append(f"    tags: [\"pilihan-ganda\", \"konsep\"],")
        lines.append(f"  }},")
    lines.append(f"];\n")
    lines.append(f"export default bab{bab}Questions;")
    return "\n".join(lines)


def main():
    js_names = {
        8: "bab-8-nonlinear.js",
        9: "bab-9-ml-intro.js",
        10: "bab-10-ml-lanjut.js",
        11: "bab-11-shrinkage.js",
        12: "bab-12-storytelling.js",
    }
    for bab, patches in PATCHES.items():
        json_path = os.path.join(BASE, f"bab{bab}.json")
        with open(json_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
        for num, patch in patches.items():
            q = questions[num - 1]
            q["question"] = patch["question"]
            q["options"] = patch["options"]
            q["answer"] = patch["answer"]
            q["explanation"] = patch["explanation"]
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        js_path = os.path.join(OUT, js_names[bab])
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(questions_to_js(bab, questions))
        print(f"Patched and rewrote BAB {bab}: {len(patches)} questions")


if __name__ == "__main__":
    main()
