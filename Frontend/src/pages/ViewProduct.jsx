import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/ViewProduct.css";

const API_URL = "http://localhost:3000";

function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
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
        console.error(error);

        setError(
          "Unable to load product."
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    } else {
      setError("Product ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const addToCart = () => {
    if (!product) {
      return;
    }

    const oldCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existingProduct =
      oldCart.find(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

    let newCart;

    if (existingProduct) {
      newCart = oldCart.map((item) => {
        if (
          String(item.id) ===
          String(product.id)
        ) {
          return {
            ...item,
            quantity:
              Number(item.quantity || 1) + 1,
          };
        }

        return item;
      });
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

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  const imageError = (event) => {
    event.currentTarget.src =
      "https://placehold.co/600x500/f5f5f5/777?text=Toy";
  };

  /* LOADING */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="view-product-page">
          <div className="view-product-loading">

            <div className="view-product-spinner"></div>

            <h2>
              Loading product...
            </h2>

            <p>
              Please wait.
            </p>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* ERROR */

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="view-product-page">

          <div className="view-product-error">

            <div className="view-product-error-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load Product
            </h2>

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

        </main>

        <Footer />
      </>
    );
  }

  const name =
    product.name ||
    product.title ||
    "Product";

  const image =
    product.image ||
    "https://placehold.co/600x500/f5f5f5/777?text=Toy";

  const stock = Number(
    product.stock || 0
  );

  return (
    <>
      {/* ONE NAVBAR ONLY */}

      <Navbar />

      <main className="view-product-page">

        <div className="view-product-container">

          {/* BREADCRUMB */}

          <div className="product-breadcrumb">

            <Link to="/">
              Home
            </Link>

            <span>→</span>

            <Link to="/products">
              Products
            </Link>

            <span>→</span>

            <span>
              {name}
            </span>

          </div>

          {/* PRODUCT DETAILS */}

          <section className="view-product-details">

            {/* IMAGE */}

            <div className="view-product-image-section">

              <div className="view-product-image-container">

                {product.featured && (
                  <span className="view-featured-badge">
                    Featured
                  </span>
                )}

                {stock <= 0 && (
                  <span className="view-out-of-stock-badge">
                    Out of Stock
                  </span>
                )}

                <img
                  src={image}
                  alt={name}
                  className="view-product-image"
                  onError={imageError}
                />

              </div>

            </div>

            {/* PRODUCT INFO */}

            <div className="view-product-info">

              <span className="view-product-category">
                {product.category ||
                  "Toys"}
              </span>

              <h1 className="view-product-name">
                {name}
              </h1>

              {/* RATING */}

              <div className="view-product-rating">

                <span className="stars">
                  ★★★★★
                </span>

                <span className="rating-number">
                  {product.rating || 0}
                </span>

                <span className="review-number">
                  (
                  {product.reviews || 0}
                  {" "}
                  reviews)
                </span>

              </div>

              {/* PRICE */}

              <div className="view-product-price">

                <span className="view-current-price">
                  ₹
                  {formatPrice(
                    product.price
                  )}
                </span>

                {product.oldPrice &&
                  Number(product.oldPrice) >
                    Number(product.price) && (
                    <span className="view-old-price">
                      ₹
                      {formatPrice(
                        product.oldPrice
                      )}
                    </span>
                  )}

              </div>

              {/* DESCRIPTION */}

              <div className="view-product-description">

                <h3>
                  Description
                </h3>

                <p>
                  {product.description ||
                    "A fun and exciting toy for children."}
                </p>

              </div>

              {/* DETAILS */}

              <div className="view-product-extra">

                <div className="extra-item">

                  <span>
                    Age Group
                  </span>

                  <strong>
                    {product.ageGroup ||
                      "All Ages"}
                  </strong>

                </div>

                <div className="extra-item">

                  <span>
                    Category
                  </span>

                  <strong>
                    {product.category ||
                      "Toys"}
                  </strong>

                </div>

                <div className="extra-item">

                  <span>
                    Availability
                  </span>

                  <strong
                    className={
                      stock > 0
                        ? "available"
                        : "unavailable"
                    }
                  >
                    {stock > 0
                      ? `${stock} in stock`
                      : "Out of stock"}
                  </strong>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="view-product-buttons">

                <Link
                  to="/products"
                  className="continue-shopping-button"
                >
                  ← Continue Shopping
                </Link>

                {stock > 0 && (
                  <button
                    type="button"
                    className="add-to-cart-button"
                    onClick={addToCart}
                  >
                    {added
                      ? "✓ Added to Cart"
                      : "Add to Cart"}
                  </button>
                )}

                {stock > 0 && (
                  <button
                    type="button"
                    className="buy-now-button"
                    onClick={() => {
                      addToCart();
                      navigate("/cart");
                    }}
                  >
                    Buy Now
                  </button>
                )}

              </div>

              {/* SUCCESS */}

              {added && (
                <div className="cart-success-message">

                  Product added to cart!

                  <Link to="/cart">
                    View Cart
                  </Link>

                </div>
              )}

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default ViewProduct;