/* This placeholder is the temporary destination behind the portfolio's hidden passage. */
type InnerPlaceholderProps = {
  onReturn: () => void;
};

export function InnerPlaceholder({ onReturn }: InnerPlaceholderProps) {
  return (
    <main className="inner-placeholder">
      <div className="inner-placeholder-copy">
        <h1>You found the other side.</h1>
        <p>The inner world is still taking shape.</p>
        <button type="button" onClick={onReturn}>
          Return to the surface
        </button>
      </div>
    </main>
  );
}
