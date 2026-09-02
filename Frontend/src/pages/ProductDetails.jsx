import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/ProductDetails.css";

const API_URL = "http://localhost:3000";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        setError(
          "Unable to find this product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
      setError("Product ID is missing.");
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const oldCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = oldCart.find(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

    let newCart;

    if (existingProduct) {
      newCart = oldCart.map((item) =>
        String(item.id) ===
        String(product.id)
          ? {
              ...item,
              quantity:
                (Number(item.quantity) || 1) + 1,
            }
          : item
      );
    } else {
      newCart = [
        ...oldCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );

    alert("Product added to cart!");
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-details-message">
          <h2>Loading Product...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-message">

          <h2>Product Not Found</h2>

          <p>
            {error}
          </p>

          <Link
            to="/products"
            className="back-products-button"
          >
            ← Back to Products
          </Link>

        </div>
      </div>
    );
  }

  const productName =
    product.title ||
    product.name ||
    "Product";

  const price =
    Number(product.price) || 0;

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        <div className="product-details-image-box">

          <img
            src={product.image}
            alt={productName}
            className="product-details-image"
          />

        </div>

        <div className="product-details-info">

          {product.category && (
            <p className="product-details-category">
              {product.category}
            </p>
          )}

          <h1>
            {productName}
          </h1>

          <h2 className="product-details-price">
            ₹{price.toLocaleString("en-IN")}
          </h2>

          {product.rating && (
            <p className="product-details-rating">
              ⭐ {product.rating}
            </p>
          )}

          <div className="product-details-line"></div>

          <h3>Description</h3>

          <p className="product-details-description">
            {product.description ||
              "No description available."}
          </p>

          <button
            type="button"
            className="details-add-cart-button"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </button>

          <Link
            to="/cart"
            className="details-cart-button"
          >
            View Cart
          </Link>

          <Link
            to="/products"
            className="continue-shopping-link"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;