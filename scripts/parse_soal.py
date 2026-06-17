#!/usr/bin/env python3
"""Parse extracted soal latihan PDFs into structured JS quiz data."""
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


def clean_text(t):
    """Normalize whitespace and strip bullet/zero-width chars."""
    if not t:
        return ""
    t = t.replace("●​", "").replace("●", "").replace("\u200b", "").replace("\u2060", "")
    t = re.sub(r"\s+", " ", t).strip()
    return t


def normalize_source(text):
    """Remove bullets and zero-width spaces from the whole source text."""
    return text.replace("●​", "").replace("●", "").replace("\u200b", "").replace("\u2060", "")


def split_options(section_text, option_letters="ABCD"):
    """Split a question section into question text and options dict.
    First tries per-line options, then falls back to inline options like 'A. ... B. ...'."""
    required = len(option_letters)

    # Attempt 1: options each on their own line
    pattern = r"(?:^|\n)\s*[" + re.escape(option_letters) + r"]\.\s*"
    parts = re.split(pattern, section_text)
    matches = list(re.finditer(pattern, section_text))
    if len(parts) >= required + 1:
        question_text = clean_text(parts[0])
        options = {}
        for i, m in enumerate(matches):
            letter = re.search(r"[" + re.escape(option_letters) + r"]", m.group(0))
            if letter:
                letter = letter.group(0).lower()
                options[letter] = clean_text(parts[i + 1])
        if len(options) >= required - 1:
            return question_text, options

    # Attempt 2: inline options separated by spaces, e.g. "A. text B. text C. text D. text"
    inline_pattern = r"(?:^|\s)([" + re.escape(option_letters) + r"])\.\s+"
    inline_parts = re.split(inline_pattern, section_text)
    inline_matches = list(re.finditer(inline_pattern, section_text))
    if len(inline_parts) >= required + 1:
        question_text = clean_text(inline_parts[0])
        options = {}
        for i, m in enumerate(inline_matches):
            letter = m.group(1).lower()
            text = clean_text(inline_parts[i + 1])
            # Strip trailing answer key markers that may have been absorbed into last option
            text = re.split(r"\s*\*?\s*Kunci Jawaban:", text, flags=re.IGNORECASE)[0].strip()
            options[letter] = text
        if len(options) >= required - 1:
            return question_text, options

    # Fallback
    return clean_text(section_text), {}


def parse_bab8(text):
    text = normalize_source(text)
    text = re.split(r"Daftar Soal Latihan", text, flags=re.IGNORECASE)[-1]
    parts = re.split(r"\nSoal\s+(\d+)\s*\n", text)
    questions = []
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        section = parts[i + 1]
        m = re.search(r"Kunci Jawaban:\s*([A-E])\s+Penjelasan Singkat:\s*(.+)", section, re.DOTALL)
        if not m:
            print(f"  [bab8] No answer for soal {num}")
            continue
        answer = m.group(1).lower()
        explanation = clean_text(m.group(2))
        q_part = section[: m.start()]
        question, options = split_options(q_part, "ABCD")
        if question:
            questions.append({"num": num, "question": question, "options": options, "answer": answer, "explanation": explanation})
        else:
            print(f"  [bab8] Bad parse for soal {num}")
    return questions


def parse_bab9(text):
    text = normalize_source(text)
    text = re.split(r"BAGIAN 1:", text, flags=re.IGNORECASE)[-1]
    parts = re.split(r"\nSoal\s+(\d+)\s*\n", text)
    questions = []
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        section = parts[i + 1]
        m = re.search(r"Kunci Jawaban:\s*([A-E])\s*\n\s*Penjelasan:\s*(.+)", section, re.DOTALL)
        if not m:
            print(f"  [bab9] No answer for soal {num}")
            continue
        answer = m.group(1).lower()
        explanation = clean_text(m.group(2))
        q_part = section[: m.start()]
        question, options = split_options(q_part, "ABCD")
        if question:
            questions.append({"num": num, "question": question, "options": options, "answer": answer, "explanation": explanation})
        else:
            print(f"  [bab9] Bad parse for soal {num}")
    return questions


def parse_bab11(text):
    text = normalize_source(text)
    text = re.split(r"Daftar Soal Latihan", text, flags=re.IGNORECASE)[-1]
    parts = re.split(r"\nSoal\s+(\d+)\s*\n", text)
    questions = []
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        section = parts[i + 1]
        m = re.search(r"Kunci\s+Jawaban:\s*([A-E])\s*\n\s*Penjelasan:\s*(.+)", section, re.DOTALL)
        if not m:
            print(f"  [bab11] No answer for soal {num}")
            continue
        answer = m.group(1).lower()
        explanation = clean_text(m.group(2))
        q_part = section[: m.start()]
        question, options = split_options(q_part, "ABCD")
        if question:
            questions.append({"num": num, "question": question, "options": options, "answer": answer, "explanation": explanation})
        else:
            print(f"  [bab11] Bad parse for soal {num}")
    return questions


def parse_bab10(text):
    text = normalize_source(text)
    m_split = re.search(r"Bagian II:\s*Kunci Jawaban dan Pembahasan", text, re.IGNORECASE)
    if not m_split:
        print("  [bab10] Could not find Bagian II")
        return []
    q_text = text[: m_split.start()]
    a_text = text[m_split.end() :]

    q_text = re.split(r"Bagian I:", q_text, flags=re.IGNORECASE)[-1]
    parts = re.split(r"\n(\d+)\.\s+", q_text)
    q_map = {}
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        section = parts[i + 1]
        question, options = split_options(section, "ABCD")
        if question:
            q_map[num] = {"num": num, "question": question, "options": options}

    lines = a_text.splitlines()
    answer_map = {}
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        # Table format: number on one line, answer letter on next, explanation follows until next number
        if re.match(r"^\d+$", line):
            num = int(line)
            i += 1
            # skip blank lines until answer letter
            while i < len(lines) and not lines[i].strip():
                i += 1
            if i >= len(lines):
                break
            answer = lines[i].strip().lower()
            if answer not in "abcd":
                i += 1
                continue
            i += 1
            explanation_parts = []
            while i < len(lines):
                next_line = lines[i].strip()
                if re.match(r"^\d+$", next_line):
                    break
                if next_line:
                    explanation_parts.append(next_line)
                i += 1
            answer_map[num] = {"answer": answer, "explanation": clean_text(" ".join(explanation_parts))}
        else:
            i += 1

    questions = []
    for num in sorted(q_map.keys()):
        if num in answer_map:
            q = q_map[num]
            a = answer_map[num]
            questions.append({"num": num, "question": q["question"], "options": q["options"], "answer": a["answer"], "explanation": a["explanation"]})
        else:
            print(f"  [bab10] No answer for soal {num}")
    return questions


def parse_bab12(text):
    text = normalize_source(text)
    m_split = re.search(r"BAGIAN II:\s*KUNCI JAWABAN", text, re.IGNORECASE)
    if not m_split:
        print("  [bab12] Could not find Bagian II")
        return []
    q_text = text[: m_split.start()]
    a_text = text[m_split.end() :]

    q_text = re.split(r"BAGIAN I:\s*SOAL PILIHAN GANDA", q_text, flags=re.IGNORECASE)[-1]
    parts = re.split(r"\n(\d+)\.\s+", q_text)
    q_map = {}
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        section = parts[i + 1]
        question, options = split_options(section, "ABCDE")
        if question:
            q_map[num] = {"num": num, "question": question, "options": options}

    lines = a_text.splitlines()
    answer_map = {}
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if re.match(r"^\d+$", line):
            num = int(line)
            i += 1
            while i < len(lines) and not lines[i].strip():
                i += 1
            if i >= len(lines):
                break
            answer = lines[i].strip().lower()
            if answer not in "abcde":
                i += 1
                continue
            i += 1
            explanation_parts = []
            while i < len(lines):
                next_line = lines[i].strip()
                if re.match(r"^\d+$", next_line):
                    break
                if next_line:
                    explanation_parts.append(next_line)
                i += 1
            answer_map[num] = {"answer": answer, "explanation": clean_text(" ".join(explanation_parts))}
        else:
            i += 1

    questions = []
    for num in sorted(q_map.keys()):
        if num in answer_map:
            q = q_map[num]
            a = answer_map[num]
            questions.append({"num": num, "question": q["question"], "options": q["options"], "answer": a["answer"], "explanation": a["explanation"]})
        else:
            print(f"  [bab12] No answer for soal {num}")
    return questions


PARSERS = {
    8: parse_bab8,
    9: parse_bab9,
    10: parse_bab10,
    11: parse_bab11,
    12: parse_bab12,
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
    files = {
        8: "bab8_fitz.txt",
        9: "bab9_fitz.txt",
        10: "bab10_fitz.txt",
        11: "bab11_fitz.txt",
        12: "bab12_fitz.txt",
    }
    all_questions = {}
    for bab, fname in files.items():
        path = os.path.join(BASE, fname)
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        questions = PARSERS[bab](text)
        print(f"BAB {bab}: parsed {len(questions)} questions")
        all_questions[bab] = questions
        json_path = os.path.join(BASE, f"bab{bab}.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)

    js_names = {
        8: "bab-8-nonlinear.js",
        9: "bab-9-ml-intro.js",
        10: "bab-10-ml-lanjut.js",
        11: "bab-11-shrinkage.js",
        12: "bab-12-storytelling.js",
    }
    for bab, questions in all_questions.items():
        js_path = os.path.join(OUT, js_names[bab])
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(questions_to_js(bab, questions))
        print(f"Wrote {js_path}")


if __name__ == "__main__":
    main()
