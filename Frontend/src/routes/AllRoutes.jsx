import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import FeaturedProducts from "../pages/FeaturedProducts";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ViewProduct from "../pages/ViewProduct";

import Navbar from "../components/Navbar";

import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import AddProduct from "../admin/AddProduct";
import AdminProducts from "../admin/AdminProducts";
import EditProduct from "../admin/EditProduct";
import ManageOrders from "../admin/ManageOrders";
import ManageProducts from "../admin/ManageProducts";
import ManageUsers from "../admin/ManageUsers";

function AllRoutes() {
  return (
    <Routes>

      {/* =========================
          CUSTOMER HOME
      ========================= */}

      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />

      {/* =========================
          PRODUCTS
      ========================= */}

      <Route
        path="/products"
        element={
          <>
            <Navbar />
            <Products />
          </>
        }
      />

      {/* =========================
          VIEW PRODUCT
      ========================= */}

      <Route
        path="/product/:id"
        element={
          <>
            <Navbar />
            <ViewProduct />
          </>
        }
      />

      {/* =========================
          CATEGORIES
      ========================= */}

      <Route
        path="/categories"
        element={
          <>
            <Navbar />
            <Categories />
          </>
        }
      />

      {/* =========================
          FEATURED PRODUCTS
      ========================= */}

      <Route
        path="/featured-products"
        element={
          <>
            <Navbar />
            <FeaturedProducts />
          </>
        }
      />

      {/* =========================
          CART
      ========================= */}

      <Route
        path="/cart"
        element={
          <>
            <Navbar />
            <Cart />
          </>
        }
      />

      {/* =========================
          CHECKOUT
      ========================= */}

      <Route
        path="/checkout"
        element={
          <>
            <Navbar />
            <Checkout />
          </>
        }
      />

      {/* =========================
          PROFILE
      ========================= */}

      <Route
        path="/profile"
        element={
          <>
            <Navbar />
            <Profile />
          </>
        }
      />

      {/* =========================
          LOGIN
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================
          REGISTER
      ========================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================
          ADMIN
      ========================= */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="products"
          element={<AdminProducts />}
        />

        <Route
          path="add-product"
          element={<AddProduct />}
        />

        <Route
          path="edit-product/:id"
          element={<EditProduct />}
        />

        <Route
          path="orders"
          element={<ManageOrders />}
        />

        <Route
          path="manage-products"
          element={<ManageProducts />}
        />

        <Route
          path="users"
          element={<ManageUsers />}
        />

      </Route>

      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="*"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />

    </Routes>
  );
}

export default AllRoutes;