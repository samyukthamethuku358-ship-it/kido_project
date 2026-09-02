import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../styles/EditProduct.css";

const API_URL = "http://localhost:3000";

const EditProduct = () => {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [formData, setFormData] =
    useState({
      title: "",
      price: "",
      category: "",
      image: "",
      description: "",
      stock: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // CHECK ADMIN + LOAD PRODUCT
  // =====================================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {

      const user =
        JSON.parse(storedUser);

      if (
        !user.role ||
        user.role.toLowerCase() !==
          "admin"
      ) {

        alert(
          "Access denied. Admin only."
        );

        navigate("/", {
          replace: true,
        });

        return;
      }

      fetchProduct();

    } catch (error) {

      console.error(error);

      localStorage.removeItem(
        "user"
      );

      navigate("/login", {
        replace: true,
      });
    }

  }, [id, navigate]);

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  const fetchProduct =
    async () => {

      try {

        setLoading(true);

        const response =
          await fetch(
            `${API_URL}/products/${id}`
          );

        if (!response.ok) {
          throw new Error(
            "Product not found"
          );
        }

        const product =
          await response.json();

        setFormData({

          title:
            product.title ||
            product.name ||
            "",

          price:
            product.price ?? "",

          category:
            product.category ||
            "",

          image:
            product.image ||
            product.imageUrl ||
            product.thumbnail ||
            "",

          description:
            product.description ||
            "",

          stock:
            product.stock ?? "",
        });

      } catch (error) {

        console.error(error);

        alert(
          "Unable to load this product."
        );

        navigate(
          "/admin/products"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // INPUT
  // =====================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;

      setFormData(
        (previousData) => ({
          ...previousData,
          [name]: value,
        })
      );
    };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (!formData.title.trim()) {
        alert(
          "Please enter product name."
        );
        return;
      }

      if (formData.price === "") {
        alert(
          "Please enter product price."
        );
        return;
      }

      if (!formData.category) {
        alert(
          "Please select a category."
        );
        return;
      }

      if (!formData.image.trim()) {
        alert(
          "Please enter product image URL."
        );
        return;
      }

      if (
        !formData.description.trim()
      ) {
        alert(
          "Please enter product description."
        );
        return;
      }

      if (formData.stock === "") {
        alert(
          "Please enter product stock."
        );
        return;
      }

      try {

        setSaving(true);

        const updatedProduct = {

          title:
            formData.title.trim(),

          price:
            Number(formData.price),

          category:
            formData.category,

          image:
            formData.image.trim(),

          description:
            formData.description.trim(),

          stock:
            Number(formData.stock),
        };

        const response =
          await fetch(
            `${API_URL}/products/${id}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                updatedProduct
              ),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to update product"
          );
        }

        await response.json();

        alert(
          "Product updated successfully!"
        );

        navigate(
          "/admin/products"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Unable to update product. Make sure JSON Server is running."
        );

      } finally {

        setSaving(false);
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="edit-product-page">

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          ← Back to Products
        </button>

        <div className="loading">
          Loading product...
        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="edit-product-page">

      <button
        className="back-btn"
        onClick={() =>
          navigate(
            "/admin/products"
          )
        }
      >
        ← Back to Products
      </button>


      <div className="edit-product-header">

        <h1>
          Edit Product
        </h1>

        <p>
          Update the product
          information below.
        </p>

      </div>


      <form
        className="edit-product-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label>
            Product Name *
          </label>

          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />

        </div>


        <div className="form-group">

          <label>
            Price (₹) *
          </label>

          <input
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
          />

        </div>


        <div className="form-group">

          <label>
            Category *
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >

            <option value="">
              Select Category
            </option>

            <option value="Educational">
              Educational
            </option>

            <option value="Games">
              Games
            </option>

            <option value="Remote Control">
              Remote Control
            </option>

            <option value="Dolls">
              Dolls
            </option>

            <option value="Baby Toys">
              Baby Toys
            </option>

            <option value="Outdoor">
              Outdoor
            </option>

            <option value="Puzzles">
              Puzzles
            </option>

            <option value="Vehicles">
              Vehicles
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            Stock *
          </label>

          <input
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
          />

        </div>


        <div className="form-group full-width">

          <label>
            Product Image URL *
          </label>

          <input
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
          />

        </div>


        {formData.image && (

          <div className="image-preview">

            <p>
              Current Image
            </p>

            <img
              src={formData.image}
              alt="Product preview"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />

          </div>

        )}


        <div className="form-group full-width">

          <label>
            Description *
          </label>

          <textarea
            name="description"
            rows="6"
            value={
              formData.description
            }
            onChange={handleChange}
          />

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            disabled={saving}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="save-product-btn"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditProduct;