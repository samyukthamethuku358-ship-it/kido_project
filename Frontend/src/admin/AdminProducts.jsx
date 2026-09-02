import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageProducts.css";

const API_URL = "http://localhost:3000";

function ManageProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/products`
      );

      if (!response.ok) {
        throw new Error(
          "Products could not be loaded"
        );
      }

      const data = await response.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load products. Please start JSON Server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to delete product"
        );
      }

      setProducts((current) =>
        current.filter(
          (product) =>
            String(product.id) !==
            String(id)
        )
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="manage-products-page">
        <div className="manage-products-message">
          <h2>Loading Products...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-products-page">

      <div className="manage-products-header">

        <div>
          <h1>View Products</h1>

          <p>
            Manage all products in your
            KiddoCart store.
          </p>
        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>

      </div>

      {error && (
        <div className="products-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchProducts}
          >
            Retry
          </button>
        </div>
      )}

      {!error &&
        products.length === 0 && (
          <div className="manage-products-message">

            <h2>
              No Products Found
            </h2>

            <p>
              Add your first product.
            </p>

            <button
              type="button"
              className="add-product-button"
              onClick={handleAddProduct}
            >
              + Add Product
            </button>

          </div>
        )}

      {!error &&
        products.length > 0 && (

          <div className="products-table-container">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product.id}>

                    <td>

                      <img
                        src={product.image}
                        alt={
                          product.title ||
                          product.name ||
                          "Product"
                        }
                        className="product-table-image"
                      />

                    </td>

                    <td>
                      <strong>
                        {product.title ||
                          product.name ||
                          "Product"}
                      </strong>
                    </td>

                    <td>
                      {product.category ||
                        "General"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>

                      <div className="product-table-actions">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEdit(
                              product.id
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

    </div>
  );
}

export default ManageProducts;