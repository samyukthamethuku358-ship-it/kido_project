import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/FeaturedProducts.css";

const API_URL = "http://localhost:3000";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH FEATURED PRODUCTS
  // =====================================================

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid products data");
      }

      // -------------------------------------------------
      // Get only featured products
      // Supports:
      // featured: true
      // isFeatured: true
      // featured: "true"
      // isFeatured: "true"
      // -------------------------------------------------

      const featured = data.filter((product) => {
        return (
          product?.featured === true ||
          product?.isFeatured === true ||
          String(product?.featured).toLowerCase() === "true" ||
          String(product?.isFeatured).toLowerCase() === "true"
        );
      });

      setProducts(featured);
    } catch (err) {
      console.error("Featured Products Error:", err);

      setProducts([]);

      setError(
        "Unable to load featured products. Please make sure JSON Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="featured-page">
        <div className="featured-container">
          <div className="featured-loading">
            <div className="featured-spinner"></div>

            <h2>Loading featured products...</h2>

            <p>
              Please wait while we find our best toys for you.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="featured-page">
        <div className="featured-container">
          <section className="featured-error">
            <div className="featured-error-icon">
              ⚠️
            </div>

            <h2>Unable to Load Featured Products</h2>

            <p>{error}</p>

            <div className="featured-server-command">
              <strong>Start JSON Server:</strong>

              <code>
                npx json-server --watch db.json --port 3000
              </code>
            </div>

            <button
              type="button"
              className="featured-retry-button"
              onClick={fetchFeaturedProducts}
            >
              Try Again
            </button>
          </section>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="featured-page">
      <div className="featured-container">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="featured-hero">
          <div className="featured-hero-content">

            <span className="featured-label">
              ⭐ KIDDOCART
            </span>

            <h1>
              Featured
              <span> Toys</span>
            </h1>

            <p>
              Discover our hand-picked collection of
              exciting, creative and educational toys
              loved by kids and parents.
            </p>

            <div className="featured-hero-buttons">
              <Link
                to="/products"
                className="featured-shop-button"
              >
                Shop All Toys
              </Link>

              <Link
                to="/categories"
                className="featured-category-button"
              >
                Browse Categories
              </Link>
            </div>

          </div>

          <div className="featured-hero-visual">
            <div className="featured-decoration featured-star">
              ⭐
            </div>

            <div className="featured-main-toy">
              🧸
            </div>

            <div className="featured-decoration featured-balloon">
              🎈
            </div>

            <div className="featured-decoration featured-gift">
              🎁
            </div>
          </div>
        </section>


        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <section className="featured-products-section">

          <div className="featured-section-header">
            <div>
              <span className="featured-section-label">
                OUR TOP PICKS
              </span>

              <h2>
                Featured Products
              </h2>

              <p>
                Explore some of the best toys available
                in our store.
              </p>
            </div>

            <Link
              to="/products"
              className="featured-view-all"
            >
              View All Products →
            </Link>
          </div>


          {/* =================================================
              NO FEATURED PRODUCTS
          ================================================= */}

          {products.length === 0 ? (
            <div className="featured-empty">

              <div className="featured-empty-icon">
                🧸
              </div>

              <h2>
                No Featured Products Yet
              </h2>

              <p>
                We are preparing some amazing toys
                for you. Please check all our products
                instead.
              </p>

              <Link
                to="/products"
                className="featured-shop-button"
              >
                Explore All Products
              </Link>

            </div>
          ) : (

            /* =================================================
               PRODUCT GRID
            ================================================= */

            <div className="featured-products-grid">

              {products.map((product, index) => {

                const productId =
                  product?.id ?? index + 1;

                return (
                  <ProductCard
                    key={productId}
                    product={product}
                  />
                );
              })}

            </div>
          )}

        </section>


        {/* =================================================
            BOTTOM PROMOTIONAL BANNER
        ================================================= */}

        <section className="featured-bottom-banner">

          <div className="featured-banner-content">

            <span className="featured-banner-icon">
              🎁
            </span>

            <div>
              <h2>
                Find Something Special
              </h2>

              <p>
                Fun, learning and creativity are
                waiting for your little explorer.
              </p>
            </div>

            <Link
              to="/products"
              className="featured-banner-button"
            >
              Explore Toys →
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}

export default FeaturedProducts;