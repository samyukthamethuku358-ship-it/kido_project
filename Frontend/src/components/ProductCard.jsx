import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const API_URL = "http://localhost:3000";

function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const productId = product.id;

  const productName =
    product.name ||
    product.title ||
    "Kids Toy";

  const productImage =
    product.image ||
    product.imageUrl ||
    product.img ||
    product.thumbnail ||
    "";

  const productPrice = Number(
    product.price ||
    product.currentPrice ||
    0
  );

  const originalPrice = Number(
    product.originalPrice ||
    product.oldPrice ||
    product.mrp ||
    0
  );

  const rating =
    product.rating ||
    4.5;

  const category =
    product.category ||
    "Kids Toys";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/400x400/f5f5f5/777?text=Toy";
  };

  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}

      <Link
        to={`/product/${productId}`}
        className="product-image-link"
      >
        <div className="product-image-container">

          <img
            src={productImage}
            alt={productName}
            className="product-image"
            onError={handleImageError}
          />

        </div>
      </Link>

      {/* PRODUCT INFORMATION */}

      <div className="product-card-content">

        <span className="product-category">
          {category}
        </span>

        <Link
          to={`/product/${productId}`}
          className="product-name-link"
        >
          <h3 className="product-name">
            {productName}
          </h3>
        </Link>

        {/* RATING */}

        <div className="product-rating">
          <span>
            ⭐
          </span>

          <span>
            {rating}
          </span>
        </div>

        {/* PRICE */}

        <div className="product-price-section">

          <span className="product-price">
            ₹{productPrice.toLocaleString("en-IN")}
          </span>

          {originalPrice > productPrice &&
            originalPrice > 0 && (
              <span className="product-original-price">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}

        </div>

        {/* BUTTONS */}

        <div className="product-card-buttons">

          <Link
            to={`/product/${productId}`}
            className="view-product-btn"
          >
            View Product
          </Link>

          <button
            type="button"
            className="add-to-cart-btn"
            onClick={() => {
              const existingCart =
                JSON.parse(
                  localStorage.getItem("cart") || "[]"
                );

              const existingIndex =
                existingCart.findIndex(
                  (item) =>
                    String(item.id) ===
                    String(product.id)
                );

              if (existingIndex >= 0) {
                existingCart[existingIndex].quantity =
                  Number(
                    existingCart[existingIndex].quantity ||
                      1
                  ) + 1;
              } else {
                existingCart.push({
                  ...product,
                  quantity: 1,
                });
              }

              localStorage.setItem(
                "cart",
                JSON.stringify(existingCart)
              );

              window.dispatchEvent(
                new Event("cartUpdated")
              );

              alert(
                `${productName} added to cart!`
              );
            }}
          >
            🛒 Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;