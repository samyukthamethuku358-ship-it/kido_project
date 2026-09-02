import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";

const API_URL = "http://localhost:3000";

function AddProducts() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.title ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const newProduct = {
        title: formData.title.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        image: formData.image.trim(),
        age: formData.age.trim(),
      };

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      setMessage("Product added successfully!");

      setFormData({
        title: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        age: "",
      });

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to add product. Please make sure JSON Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-products-page">
      <div className="add-products-container">

        {/* Header */}
        <div className="add-products-header">
          <div>
            <h1>Add New Product</h1>
            <p>Add a new toy or kids product to KiddoCart.</p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form
          className="add-product-form"
          onSubmit={handleSubmit}
        >

          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="title">
              Product Name <span>*</span>
            </label>

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span>*</span>
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Building Toys">
                Building Toys
              </option>
              <option value="Educational">
                Educational
              </option>
              <option value="Art & Craft">
                Art & Craft
              </option>
              <option value="Games">
                Games
              </option>
              <option value="Soft Toys">
                Soft Toys
              </option>
              <option value="Outdoor Toys">
                Outdoor Toys
              </option>
              <option value="Vehicles">
                Vehicles
              </option>
              <option value="Dolls">
                Dolls
              </option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">
              Price (₹) <span>*</span>
            </label>

            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
            />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">
              Stock <span>*</span>
            </label>

            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="0"
              required
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label htmlFor="age">
              Recommended Age
            </label>

            <input
              type="text"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Example: 3-6 years"
            />
          </div>

          {/* Image URL */}
          <div className="form-group full-width">
            <label htmlFor="image">
              Product Image URL
            </label>

            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste product image URL"
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />
          </div>

          {/* Buttons */}
          <div className="form-actions full-width">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;