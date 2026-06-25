// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Small product cover tile. With no real image, it builds a placeholder from the product's colour + first letter.

// props: product (product object, uses color/letter/type), size (optional size class, e.g. "lg"/"sm")
export default function Cover({ product, size = "" }) {
  return (
    // The --cover CSS variable passes the product colour to the stylesheet for the tile background
    <div className={`cover ${size}`} style={{ "--cover": product.color }}>
      <span className="cover-letter">{product.letter}</span>{/* First letter of the name */}
      <span className="cover-type">{product.type}</span>{/* Type: Book/Movie/Game */}
    </div>
  );
}
