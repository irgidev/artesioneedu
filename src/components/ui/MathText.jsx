import katex from 'katex';

const PLACEHOLDER = '\uE000'; // Private Use Area character — very unlikely to appear in content

/**
 * Render text that may contain inline ($...$) or display ($$...$$) LaTeX math.
 * Falls back to plain text for non-math segments or invalid LaTeX.
 */
export default function MathText({ text, className = '', as: Tag = 'span' }) {
  if (!text) return null;

  const segments = [];
  let working = text;

  // Replace display math $$...$$ with placeholders first.
  const displayMatches = [];
  working = working.replace(/\$\$(.*?)\$\$/g, (match, math) => {
    displayMatches.push(math ?? '');
    return `${PLACEHOLDER}D${displayMatches.length - 1}${PLACEHOLDER}`;
  });

  // Replace inline math $...$ with placeholders.
  const inlineMatches = [];
  working = working.replace(/\$(.*?)\$/g, (match, math) => {
    inlineMatches.push(math ?? '');
    return `${PLACEHOLDER}I${inlineMatches.length - 1}${PLACEHOLDER}`;
  });

  // Split by placeholder and rebuild.
  const parts = working.split(PLACEHOLDER).filter(Boolean);

  parts.forEach((part, idx) => {
    // Only treat parts that match the placeholder pattern D<n> or I<n> as math.
    // Otherwise text beginning with 'D'/'I' (e.g. 'Dalam', 'Implementasi') would
    // be mis-parsed as a math placeholder and render as $$undefined$$.
    if (/^D\d+$/.test(part)) {
      const index = Number(part.slice(1));
      const math = displayMatches[index];
      if (math === undefined || math === null) {
        segments.push(<span key={idx}>{`$$${String(math)}$$`}</span>);
        return;
      }
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
    } else if (/^I\d+$/.test(part)) {
      const index = Number(part.slice(1));
      const math = inlineMatches[index];
      if (math === undefined || math === null) {
        segments.push(<span key={idx}>{`$${String(math)}$`}</span>);
        return;
      }
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
