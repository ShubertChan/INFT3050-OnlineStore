// Product cover tile (replaces the cover() helper from ui.js).
export default function Cover({ product, size = "" }) {
  return (
    <div className={`cover ${size}`} style={{ "--cover": product.color }}>
      <span className="cover-letter">{product.letter}</span>
      <span className="cover-type">{product.type}</span>
    </div>
  );
}
