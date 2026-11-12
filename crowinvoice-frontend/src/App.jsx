
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Page imports
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Main App
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect home to login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register page */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard page */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
