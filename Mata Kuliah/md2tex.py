import os
import re
import sys

def escape_latex(text):
    # Escape special LaTeX characters, but protect math zones
    # We'll handle math separately, so this is for plain text
    chars = {
        '\\': r'\textbackslash{}',
        '{': r'\{',
        '}': r'\}',
        '$': r'\$',
        '&': r'\&',
        '#': r'\#',
        '^': r'\textasciicircum{}',
        '_': r'\_',
        '~': r'\textasciitilde{}',
        '%': r'\%',
    }
    for ch, repl in chars.items():
        text = text.replace(ch, repl)
    return text

def inline_math_repl(m):
    math = m.group(1)
    # Ensure \text command works
    return f'${math}$'

def display_math_repl(m):
    math = m.group(1).strip()
    return '\\\\[' + '\n' + math + '\n' + '\\\\]'

def process_line(line):
    # Convert inline code
    line = re.sub(r'`([^`]+)`', r'\\texttt{\1}', line)
    # Convert bold
    line = re.sub(r'\*\*([^*]+)\*\*', r'\\textbf{\1}', line)
    # Convert italic
    line = re.sub(r'\*([^*]+)\*', r'\\emph{\1}', line)
    # Convert display math $$...$$
    line = re.sub(r'\$\$(.+?)\$\$', display_math_repl, line, flags=re.DOTALL)
    # Convert inline math $...$ (but not already converted display math)
    # Simple approach: replace remaining $...$
    line = re.sub(r'\$([^$]+)\$', inline_math_repl, line)
    return line

def md_to_tex(md_path, tex_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    body = []
    in_code_block = False
    in_table = False
    table_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Code blocks
        if stripped.startswith('```'):
            if not in_code_block:
                in_code_block = True
                body.append('\\begin{lstlisting}[language=Python]\n')
            else:
                in_code_block = False
                body.append('\\end{lstlisting}\n')
            i += 1
            continue

        if in_code_block:
            # Escape LaTeX special chars inside listings
            body.append(line)
            i += 1
            continue

        # Blockquotes
        if stripped.startswith('>'):
            content = stripped[1:].strip()
            body.append(f'\\begin{{quote}}\n{process_line(content)}\\end{{quote}}\n\n')
            i += 1
            continue

        # Horizontal rule
        if stripped == '---':
            body.append('\\hrule\n\n')
            i += 1
            continue

        # Tables
        if '|' in stripped and not stripped.startswith('#'):
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(stripped)
            i += 1
            continue
        else:
            if in_table:
                # Process table
                body.append(convert_table(table_lines))
                in_table = False
                table_lines = []

        # Headings
        if stripped.startswith('# '):
            title = stripped[2:]
            body.append(f'\\section{{{process_line(title)}}}\n')
        elif stripped.startswith('## '):
            title = stripped[3:]
            body.append(f'\\subsection{{{process_line(title)}}}\n')
        elif stripped.startswith('### '):
            title = stripped[4:]
            body.append(f'\\subsubsection{{{process_line(title)}}}\n')
        elif stripped.startswith('#### '):
            title = stripped[5:]
            body.append(f'\\paragraph{{{process_line(title)}}}\n')
        elif stripped.startswith('- ') or stripped.startswith('1.'):
            # Lists handled separately below
            pass
        elif stripped == '':
            body.append('\n')
        else:
            body.append(process_line(line) + '\n')

        i += 1

    if in_table:
        body.append(convert_table(table_lines))

    # Second pass: handle display math (multiline), then lists
    text = ''.join(body)
    text = re.sub(r'\$\$(.+?)\$\$', display_math_repl, text, flags=re.DOTALL)
    text = convert_lists(text)

    return text

def convert_table(table_lines):
    # Filter separator lines like |---|---|
    rows = []
    for line in table_lines:
        if re.match(r'^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)*\|?$', line):
            continue
        cells = [c.strip() for c in line.split('|')]
        cells = [c for c in cells if c]
        if cells:
            rows.append(cells)

    if not rows:
        return ''

    num_cols = max(len(r) for r in rows)
    col_spec = '|' + 'l|' * num_cols
    tex = f'\\begin{{tabular}}{{{col_spec}}}\n\\hline\n'
    for row in rows:
        processed = [process_line(c) for c in row]
        # Pad if needed
        while len(processed) < num_cols:
            processed.append('')
        tex += ' & '.join(processed) + ' \\\\\n\\hline\n'
    tex += '\\end{tabular}\n\n'
    return tex

def convert_lists(text):
    lines = text.splitlines(keepends=True)
    out = []
    in_ul = False
    in_ol = False

    for line in lines:
        stripped = line.strip()
        if re.match(r'^-\s+', stripped):
            item = re.sub(r'^-\s+', '', stripped)
            if not in_ul:
                in_ul = True
                out.append('\\begin{itemize}\n')
            out.append(f'\\item {process_line(item)}\n')
        elif re.match(r'^\d+\.\s+', stripped):
            item = re.sub(r'^\d+\.\s+', '', stripped)
            if not in_ol:
                in_ol = True
                out.append('\\begin{enumerate}\n')
            out.append(f'\\item {process_line(item)}\n')
        else:
            if in_ul:
                in_ul = False
                out.append('\\end{itemize}\n')
            if in_ol:
                in_ol = False
                out.append('\\end{enumerate}\n')
            out.append(line)

    if in_ul:
        out.append('\\end{itemize}\n')
    if in_ol:
        out.append('\\end{enumerate}\n')

    return ''.join(out)

def main():
    md_dir = 'markdown'
    tex_dir = 'latex'
    os.makedirs(tex_dir, exist_ok=True)

    preamble = (
        r'\documentclass[12pt,a4paper]{article}' + '\n'
        r'\usepackage[utf8]{inputenc}' + '\n'
        r'\usepackage[T1]{fontenc}' + '\n'
        r'\usepackage{amsmath,amssymb,amsthm}' + '\n'
        r'\usepackage{graphicx}' + '\n'
        r'\usepackage{booktabs}' + '\n'
        r'\usepackage{longtable}' + '\n'
        r'\usepackage{array}' + '\n'
        r'\usepackage{hyperref}' + '\n'
        r'\usepackage{listings}' + '\n'
        r'\usepackage{xcolor}' + '\n'
        r'\usepackage[margin=1in]{geometry}' + '\n'
        r'\usepackage{indentfirst}' + '\n\n'
        r'\lstset{' + '\n'
        r'    language=Python,' + '\n'
        r'    basicstyle=\ttfamily\small,' + '\n'
        r'    keywordstyle=\color{blue},' + '\n'
        r'    commentstyle=\color{gray},' + '\n'
        r'    stringstyle=\color{orange},' + '\n'
        r'    breaklines=true,' + '\n'
        r'    frame=single,' + '\n'
        r'    showstringspaces=false' + '\n'
        r'}' + '\n\n'
        r'\title{'
    )

    for fn in sorted(os.listdir(md_dir)):
        if not fn.endswith('.md'):
            continue
        md_path = os.path.join(md_dir, fn)
        base = os.path.splitext(fn)[0]
        tex_path = os.path.join(tex_dir, base + '.tex')

        with open(md_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
        title = first_line.lstrip('#').strip()

        body = md_to_tex(md_path, tex_path)

        full_tex = (
            preamble + title + "}\n"
            "\\author{Yeni Herdiyeni}\n"
            "\\date{}\n\n"
            "\\begin{document}\n"
            "\\maketitle\n"
            "\\tableofcontents\n"
            "\\newpage\n\n" +
            body +
            "\n\n\\end{document}\n"
        )

        with open(tex_path, 'w', encoding='utf-8') as f:
            f.write(full_tex)
        print(f'Created {tex_path}')

if __name__ == '__main__':
    main()
