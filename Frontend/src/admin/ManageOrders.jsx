import { useEffect, useState } from "react";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => {
        console.error("Error loading orders:", error);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Manage Orders</h1>

      <p>Total Orders: {orders.length}</p>

      {orders.length === 0 && (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default ManageOrders;