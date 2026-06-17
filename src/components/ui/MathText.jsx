import katex from 'katex';

/**
 * Render text that may contain inline ($...$) or display ($$...$$) LaTeX math.
 * Falls back to plain text for non-math segments or invalid LaTeX.
 */
export default function MathText({ text, className = '', as: Tag = 'span' }) {
  if (!text) return null;

  const segments = [];
  // Split by inline ($...$) and display ($$...$$) math.
  // We process display first by temporarily marking it, then inline.
  const placeholder = '\u0000';
  let working = text;

  // Replace display math $$...$$ with placeholders
  const displayMatches = [];
  working = working.replace(/\$\$(.*?)\$\$/g, (match, math) => {
    displayMatches.push(math);
    return `${placeholder}D${displayMatches.length - 1}${placeholder}`;
  });

  // Replace inline math $...$ with placeholders
  const inlineMatches = [];
  working = working.replace(/\$(.*?)\$/g, (match, math) => {
    inlineMatches.push(math);
    return `${placeholder}I${inlineMatches.length - 1}${placeholder}`;
  });

  // Now split by placeholders and rebuild
  const parts = working.split(placeholder).filter(Boolean);

  parts.forEach((part, idx) => {
    if (part.startsWith('D')) {
      const index = Number(part.slice(1));
      const math = displayMatches[index];
      try {
        const html = katex.renderToString(math, {
          throwOnError: false,
          displayMode: true,
        });
        segments.push(
          <span
            key={idx}
            className="katex-display-wrapper"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        segments.push(<span key={idx}>{`$$${math}$$`}</span>);
      }
    } else if (part.startsWith('I')) {
      const index = Number(part.slice(1));
      const math = inlineMatches[index];
      try {
        const html = katex.renderToString(math, {
          throwOnError: false,
          displayMode: false,
        });
        segments.push(
          <span
            key={idx}
            className="katex-inline-wrapper"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        segments.push(<span key={idx}>{`$${math}$`}</span>);
      }
    } else {
      segments.push(<span key={idx}>{part}</span>);
    }
  });

  return <Tag className={className}>{segments}</Tag>;
}
