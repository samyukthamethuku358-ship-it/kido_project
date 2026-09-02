import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";

const API_URL = "http://localhost:3000";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        let result = Array.isArray(data) ? data : [];

        if (selectedCategory) {
          result = result.filter((product) => {
            const productCategory = String(
              product.category || ""
            )
              .trim()
              .toLowerCase();

            const category = String(selectedCategory)
              .trim()
              .toLowerCase();

            return productCategory === category;
          });
        }

        setProducts(result);
      } catch (err) {
        console.error("Products error:", err);

        setError(
          "Unable to load products. Please make sure JSON Server is running on port 3000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <>
      <main className="products-page">

        {/* HEADER */}

        <section className="products-header">
          <div className="products-header-content">

            <h1>
              {selectedCategory
                ? selectedCategory
                : "All Products"}
            </h1>

            <p>
              {selectedCategory
                ? `Showing products from ${selectedCategory}`
                : "Discover fun, exciting and educational toys for kids."}
            </p>

            {selectedCategory && (
              <Link
                to="/products"
                className="clear-category-button"
              >
                View All Products
              </Link>
            )}

          </div>
        </section>

        {/* LOADING */}

        {loading && (
          <div className="products-message">
            <div className="products-spinner"></div>

            <h2>
              Loading Products...
            </h2>

            <p>
              Please wait while we load the products.
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="products-message products-error">

            <div className="products-error-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load Products
            </h2>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <section className="products-container">

              <div className="products-count">
                <strong>
                  {products.length}
                </strong>{" "}
                {products.length === 1
                  ? "Product"
                  : "Products"}
              </div>

              <div className="products-grid">

                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>

            </section>
          )}

        {/* NO PRODUCTS */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="products-message">

              <div className="products-error-icon">
                🧸
              </div>

              <h2>
                No Products Found
              </h2>

              <p>
                There are no products available
                in this category.
              </p>

              <Link
                to="/products"
                className="clear-category-button"
              >
                View All Products
              </Link>

            </div>
          )}

      </main>

      <Footer />
    </>
  );
}

export default Products;