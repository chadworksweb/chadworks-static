// GLYPH TITLE BAR -- a section heading framed by a shade ramp, on a rule.
// TRACED (not ported) from the chadlewine Sovereignty Audit page's GlyphTitle /
// si-banner-bar: same idea, rebuilt on CWS tokens and CWS class names, because
// the SSA original is styled by chadlewine's SI Night modules and none of that
// CSS exists here. See CWS-VSR-SERVICE.md.
//
// This is a heading PRIMITIVE, not a capsule: it renders no section, so a
// capsule can place it inside its own SectionShell.
//
// The ramp characters are the Unicode shade blocks (U+2591..U+2588), written as
// entities so the source file stays ASCII (global rule). They are decorative and
// carry no meaning, hence aria-hidden.

export function GlyphTitleBar({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cw-glyphbar">
      <span className="cw-glyphbar__ramp" aria-hidden="true">
        &#9617;&#9618;&#9619;&#9608;
      </span>
      <h2 className="cw-glyphbar__heading" id={id}>
        {children}
      </h2>
      <span className="cw-glyphbar__ramp cw-glyphbar__ramp--rev" aria-hidden="true">
        &#9608;&#9619;&#9618;&#9617;
      </span>
    </div>
  );
}

// The stepped opacity glyph that marks each act. Four IDENTICAL full-block
// chars (U+2588) so every block shares one font and one baseline; the ramp is
// opacity, never different shade characters (which would change glyph widths).
export function ActGlyph() {
  return (
    <span className="cw-act__glyph" aria-hidden="true">
      <span style={{ opacity: 0.22 }}>&#9608;</span>
      <span style={{ opacity: 0.45 }}>&#9608;</span>
      <span style={{ opacity: 0.7 }}>&#9608;</span>
      <span>&#9608;</span>
    </span>
  );
}
