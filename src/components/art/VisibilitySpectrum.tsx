// Visibility spectrum for /seo/ -- the rising-compass spectrum-bar pattern
// re-expressed for search standing: a gradient scale from Invisible to
// Cited by AI, with a breathing marker sitting where most businesses live.
// Pure CSS; server-renderable.

const STOPS = [
  { label: "Invisible", detail: "Nobody finds you" },
  { label: "Found", detail: "Page one for your phrases" },
  { label: "Chosen", detail: "Found AND picked" },
  { label: "Cited by AI", detail: "You are the answer" },
];

export function VisibilitySpectrum() {
  return (
    <div className="vis-spectrum" aria-hidden="false">
      <div className="vis-spectrum__bar">
        <span className="vis-spectrum__marker">
          <span className="vis-spectrum__marker-label">most businesses</span>
        </span>
      </div>
      <ol className="vis-spectrum__stops">
        {STOPS.map((s) => (
          <li key={s.label} className="vis-spectrum__stop">
            <strong>{s.label}</strong>
            <small>{s.detail}</small>
          </li>
        ))}
      </ol>
      <p className="vis-spectrum__caption">
        SEO moves you right. The work on this page is the second and third
        step; the AI visibility service takes you to the last one.
      </p>
    </div>
  );
}
