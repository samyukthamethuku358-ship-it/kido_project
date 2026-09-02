import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const productName =
    product.name ||
    product.title ||
    "Product";

  const productImage =
    product.image ||
    product.imageUrl ||
    product.img ||
    product.thumbnail ||
    "https://placehold.co/600x500/f5f5f5/777?text=Toy";

  const price = Number(product.price || 0);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/600x500/f5f5f5/777?text=Toy";
  };

  return (
    <article className="product-card">

      {/* IMAGE */}

      <div className="product-card-image">

        <img
          src={productImage}
          alt={productName}
          onError={handleImageError}
        />

      </div>

      {/* CONTENT */}

      <div className="product-card-content">

        <span className="product-category">
          {product.category || "Toys"}
        </span>

        <h3 className="product-name">
          {productName}
        </h3>

        <div className="product-price">
          ₹{price.toLocaleString("en-IN")}
        </div>

        {/* VIEW ITEM */}

        <Link
          to={`/product/${product.id}`}
          className="view-button"
        >
          View Item
        </Link>

      </div>

    </article>
  );
}

export default ProductCard;