import { useEffect, useState } from "react";

function ManageProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error loading products:", error);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Manage Products</h1>

      <p>Total Products: {products.length}</p>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id}>
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageProducts;