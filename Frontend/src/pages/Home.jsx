import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Footer from "../components/Footer";

const API_URL = "http://localhost:3000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [productsError, setProductsError] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(false);

    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Products data is not an array");
      }

      setProducts(data);
    } catch (error) {
      console.error("Products API Error:", error);
      setProducts([]);
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(false);

    try {
      const response = await fetch(`${API_URL}/categories`);

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Categories data is not an array");
      }

      setCategories(data);
    } catch (error) {
      console.error("Categories API Error:", error);
      setCategories([]);
      setCategoriesError(true);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =====================================================
  // PRODUCT NAME
  // =====================================================

  const getProductName = (product) => {
    return (
      product?.name ||
      product?.title ||
      product?.productName ||
      "Kids Toy"
    );
  };

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getProductImage = (product) => {
    return (
      product?.image ||
      product?.imageUrl ||
      product?.img ||
      product?.thumbnail ||
      ""
    );
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = (category) => {
    return (
      category?.name ||
      category?.title ||
      category?.category ||
      "Toys"
    );
  };

  // =====================================================
  // CATEGORY IMAGE
  // =====================================================

  const getCategoryImage = (category) => {
    return (
      category?.image ||
      category?.imageUrl ||
      category?.img ||
      category?.thumbnail ||
      ""
    );
  };

  // =====================================================
  // PRODUCT IMAGE ERROR
  // =====================================================

  const handleProductImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.style.display = "none";

    const parent = event.currentTarget.parentElement;

    if (parent) {
      const placeholder = document.createElement("div");

      placeholder.className = "product-placeholder";
      placeholder.textContent = "🧸";

      parent.appendChild(placeholder);
    }
  };

  // =====================================================
  // CATEGORY IMAGE ERROR
  // =====================================================

  const handleCategoryImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.style.display = "none";

    const parent = event.currentTarget.parentElement;

    if (parent) {
      const placeholder = document.createElement("span");

      placeholder.className = "category-placeholder";
      placeholder.textContent = "🧸";

      parent.appendChild(placeholder);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="home-page">

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="hero-badge">
            Welcome to KiddoCart 🧸
          </span>

          <h1>
            Fun Toys for
            <br />
            Happy Kids
          </h1>

          <p>
            Discover fun, exciting and educational toys
            for kids of all ages.
          </p>

          <Link
            to="/products"
            className="hero-shop-btn"
          >
            Shop Now
          </Link>

        </div>

        <div className="hero-visual">

          <div className="hero-circle hero-circle-one">
            ⭐
          </div>

          <div className="hero-toy">
            🧸
          </div>

          <div className="hero-circle hero-circle-two">
            🎈
          </div>

          <div className="hero-circle hero-circle-three">
            🎁
          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORIES SECTION
      ================================================= */}

      <section className="home-section">

        <div className="home-section-header">

          <div>
            <h2>
              Shop by Category
            </h2>

            <p>
              Find the perfect toys for your little ones
            </p>
          </div>

          <Link
            to="/categories"
            className="view-all-link"
          >
            View All →
          </Link>

        </div>

        {/* CATEGORY LOADING */}

        {categoriesLoading ? (

          <div className="home-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading categories...
            </p>

          </div>

        ) : categoriesError ? (

          /* CATEGORY ERROR */

          <div className="home-error-box">

            <div className="error-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Categories
            </h3>

            <p>
              Please make sure JSON Server is running
              on port 3000.
            </p>

            <button
              type="button"
              className="retry-button"
              onClick={fetchCategories}
            >
              Retry
            </button>

          </div>

        ) : categories.length === 0 ? (

          /* NO CATEGORIES */

          <div className="home-empty-box">

            <div>
              🧸
            </div>

            <h3>
              No Categories Available
            </h3>

            <p>
              Categories will appear here once they are
              added to your store.
            </p>

          </div>

        ) : (

          /* CATEGORY GRID */

          <div className="home-category-grid">

            {categories.slice(0, 6).map((category, index) => {

              const categoryId =
                category?.id ?? index + 1;

              const categoryName =
                getCategoryName(category);

              const categoryImage =
                getCategoryImage(category);

              return (
                <Link
                  key={categoryId}
                  to={`/products?category=${encodeURIComponent(
                    categoryName
                  )}`}
                  className="home-category-card"
                >

                  <div className="category-image-box">

                    {categoryImage ? (

                      <img
                        src={categoryImage}
                        alt={categoryName}
                        onError={handleCategoryImageError}
                      />

                    ) : (

                      <span className="category-placeholder">
                        🧸
                      </span>

                    )}

                  </div>

                  <h3>
                    {categoryName}
                  </h3>

                </Link>
              );
            })}

          </div>

        )}

      </section>

      {/* =================================================
          POPULAR PRODUCTS SECTION
      ================================================= */}

      <section className="home-section products-section">

        <div className="home-section-header">

          <div>

            <h2>
              Popular Products
            </h2>

            <p>
              Explore our most loved toys and products
            </p>

          </div>

          <Link
            to="/products"
            className="view-all-link"
          >
            View All →
          </Link>

        </div>

        {/* PRODUCT LOADING */}

        {productsLoading ? (

          <div className="home-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading products...
            </p>

          </div>

        ) : productsError ? (

          /* PRODUCT ERROR */

          <div className="home-error-box">

            <div className="error-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Products
            </h3>

            <p>
              Unable to connect to the product database.
              Please make sure JSON Server is running
              on port 3000.
            </p>

            <button
              type="button"
              className="retry-button"
              onClick={fetchProducts}
            >
              Retry
            </button>

          </div>

        ) : products.length === 0 ? (

          /* NO PRODUCTS */

          <div className="home-empty-box">

            <div>
              🛍️
            </div>

            <h3>
              No Products Available
            </h3>

            <p>
              Products will appear here once they are
              added to your store.
            </p>

          </div>

        ) : (

          /* PRODUCT GRID */

          <div className="home-product-grid">

            {products.slice(0, 8).map((product, index) => {

              const productId =
                product?.id ?? index + 1;

              const productName =
                getProductName(product);

              const productPrice =
                Number(product?.price) || 0;

              const productImage =
                getProductImage(product);

              return (
                <div
                  key={productId}
                  className="home-product-card"
                >

                  {/* PRODUCT IMAGE */}

                  <Link
                    to={`/products/${productId}`}
                    className="home-product-image"
                  >

                    {productImage ? (

                      <img
                        src={productImage}
                        alt={productName}
                        onError={handleProductImageError}
                      />

                    ) : (

                      <div className="product-placeholder">
                        🧸
                      </div>

                    )}

                  </Link>

                  {/* PRODUCT INFORMATION */}

                  <div className="home-product-info">

                    <h3>
                      {productName}
                    </h3>

                    <div className="product-rating">
                      ⭐ ⭐ ⭐ ⭐ ⭐
                    </div>

                    <div className="home-product-bottom">

                      <span className="home-product-price">
                        ₹
                        {productPrice.toLocaleString("en-IN")}
                      </span>

                      <Link
                        to={`/products/${productId}`}
                        className="home-view-btn"
                      >
                        View
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

      {/* =================================================
          PROMOTIONAL BANNER
      ================================================= */}

      <section className="home-bottom-banner">

        <div className="bottom-banner-content">

          <span className="banner-label">
            🎁 KiddoCart
          </span>

          <h2>
            Make Every Playtime
            <br />
            More Fun!
          </h2>

          <p>
            Discover toys that inspire creativity,
            learning and endless smiles.
          </p>

          <Link
            to="/products"
            className="banner-shop-btn"
          >
            Explore Products
          </Link>

        </div>

        <div className="banner-decoration">
          🎈 🧸 🎁
        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
};

export default Home;