// Visible TO-WRITE block (ported from the chad site). Renders an amber-tinted
// box with a label and the writing brief so unwritten copy is impossible to
// miss in dev or on the live page. Replace the prompt() value in the service
// data with real prose when copy is ready. See src/lib/service.ts (prompt()).

export function Prompt({ label, brief }: { label: string; brief: string }) {
  return (
    <span
      className="prompt-block"
      role="note"
      aria-label={`Writing prompt: ${label}`}
    >
      <span className="prompt-block__label">TO WRITE: {label}</span>
      <span className="prompt-block__body">{brief}</span>
    </span>
  );
}
