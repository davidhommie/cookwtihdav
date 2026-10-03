// Headline whose words rise in one after another.
export default function Words({ text, className = '', base = 100 }) {
  return (
    <h1 className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" className="rise inline-block" style={{ animationDelay: base + i * 90 + 'ms' }}>{w}&nbsp;</span>
      ))}
    </h1>
  );
}
