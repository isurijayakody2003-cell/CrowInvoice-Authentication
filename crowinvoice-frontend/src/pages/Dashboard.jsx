
import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/Service";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logoutUser();

      if (result.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h2>Crow.lk</h2>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        <h1>Welcome to CrowInvoice!</h1>

        <p>
          You have successfully logged in.
        </p>

        <div className="dashboard-card">
          <h2>Invoice Dashboard</h2>
          <p>Manage your business invoices easily.</p>
        </div>

      </main>

    </div>
  );
}

export default Dashboard;
