import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/Categories.css";

const API_URL = "http://localhost:3000";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const products = await response.json();

        const categoryMap = {};

        products.forEach((product) => {
          const category = String(product.category || "").trim();

          if (!category) {
            return;
          }

          if (!categoryMap[category]) {
            categoryMap[category] = {
              name: category,
              count: 0,
              image:
                product.image ||
                product.imageUrl ||
                product.img ||
                "https://placehold.co/600x400?text=Category",
            };
          }

          categoryMap[category].count += 1;
        });

        setCategories(Object.values(categoryMap));
      } catch (err) {
        console.error("Category error:", err);

        setError(
          "Unable to load categories. Please make sure JSON Server is running on port 3000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <main className="categories-page">

        <section className="categories-header">
          <div className="categories-header-content">

            <span className="categories-label">
              EXPLORE OUR COLLECTION
            </span>

            <h1>Shop by Category</h1>

            <p>
              Choose a category and discover the
              perfect toys for your child.
            </p>

          </div>
        </section>

        {loading && (
          <div className="categories-message">
            <div className="categories-spinner"></div>

            <h2>Loading Categories...</h2>

            <p>
              Please wait while we load the categories.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="categories-message error">

            <div className="categories-error-icon">
              ⚠️
            </div>

            <h2>Unable to Load Categories</h2>

            <p>{error}</p>

          </div>
        )}

        {!loading &&
          !error &&
          categories.length > 0 && (
            <section className="categories-section">

              <div className="categories-grid">

                {categories.map((category) => (
                  <article
                    className="category-card"
                    key={category.name}
                  >

                    <div className="category-image-wrapper">

                      <img
                        src={category.image}
                        alt={category.name}
                        className="category-image"
                        onError={(event) => {
                          event.currentTarget.onerror = null;

                          event.currentTarget.src =
                            "https://placehold.co/600x400?text=Category";
                        }}
                      />

                    </div>

                    <div className="category-content">

                      <h2>{category.name}</h2>

                      <p>
                        {category.count}{" "}
                        {category.count === 1
                          ? "Product"
                          : "Products"}
                      </p>

                      <Link
                        to={`/products?category=${encodeURIComponent(
                          category.name
                        )}`}
                        className="category-button"
                      >
                        View Products
                      </Link>

                    </div>

                  </article>
                ))}

              </div>

            </section>
          )}

        {!loading &&
          !error &&
          categories.length === 0 && (
            <div className="categories-message">

              <div className="categories-error-icon">
                🧸
              </div>

              <h2>No Categories Found</h2>

              <p>
                No product categories were found in
                your database.
              </p>

              <Link
                to="/products"
                className="category-button"
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

export default Categories;