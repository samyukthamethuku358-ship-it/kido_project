import { Link } from "react-router-dom";
import "../styles/CategoryCard.css";

function CategoryCard({ category }) {
  // =====================================================
  // SAFE CATEGORY VALUES
  // =====================================================

  const categoryName =
    category?.name ||
    category?.title ||
    category?.category ||
    "Toys";

  const categoryImage =
    category?.image ||
    category?.imageUrl ||
    category?.img ||
    "";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Link
      to={`/products?category=${encodeURIComponent(
        categoryName
      )}`}
      className="category-card"
    >

      {/* =================================================
          CATEGORY IMAGE
      ================================================= */}

      <div className="category-card-image">

        {categoryImage ? (

          <img
            src={categoryImage}
            alt={categoryName}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

        ) : (

          <div className="category-image-placeholder">
            🧸
          </div>

        )}

      </div>


      {/* =================================================
          CATEGORY OVERLAY
      ================================================= */}

      <div className="category-overlay">

        <h3>
          {categoryName}
        </h3>

        <span>
          Shop Now →
        </span>

      </div>

    </Link>
  );
}

export default CategoryCard;