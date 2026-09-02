import { useEffect, useState } from "react";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Manage Users</h1>

      <p>Total Users: {users.length}</p>

      {users.length === 0 && (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default ManageUsers;