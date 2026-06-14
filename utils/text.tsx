import React from "react";

export function renderFormattedText(text: string) {
  if (!text) return "";
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part}
        </strong>
      );
    }
    return part;
  });
}
