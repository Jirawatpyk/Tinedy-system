interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

/**
 * HighlightText component highlights matching text in a string
 * Used for search result highlighting
 *
 * @param text - The full text to display
 * @param query - The search query to highlight
 * @param className - Optional CSS classes
 */
export function HighlightText({ text, query, className }: HighlightTextProps) {
  // If no query, return plain text
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters in query
  const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  try {
    // Split text by query matches (case-insensitive)
    const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));

    return (
      <span className={className}>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-yellow-200 font-medium text-slate-900 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  } catch (error) {
    // If regex fails, return plain text
    console.error('Error in HighlightText:', error);
    return <span className={className}>{text}</span>;
  }
}
