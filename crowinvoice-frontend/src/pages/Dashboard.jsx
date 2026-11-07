
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
        <h2>Crow<span>.lk</span></h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">

        <div className="welcome-section">
          <h1>Welcome to CrowInvoice!</h1>
          <p>Here's an overview of your invoice dashboard.</p>
        </div>

        <div className="dashboard-stats">

          <div className="stat-card">
            <p>Total Invoices</p>
            <h2>128</h2>
          </div>

          <div className="stat-card">
            <p>Paid Invoices</p>
            <h2>96</h2>
          </div>

          <div className="stat-card">
            <p>Pending Invoices</p>
            <h2>32</h2>
          </div>

        </div>

        <section className="recent-invoices">
          <h2>Recent Invoices</h2>
          <p className="section-description">
            Your latest invoice activities.
          </p>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>#INV-001</td>
                  <td>John Smith</td>
                  <td>Nov 05, 2026</td>
                  <td>Rs. 25,000</td>
                  <td><span className="paid">Paid</span></td>
                </tr>

                <tr>
                  <td>#INV-002</td>
                  <td>Sarah Johnson</td>
                  <td>Nov 04, 2026</td>
                  <td>Rs. 18,500</td>
                  <td><span className="pending">Pending</span></td>
                </tr>

                <tr>
                  <td>#INV-003</td>
                  <td>Michael Brown</td>
                  <td>Nov 03, 2026</td>
                  <td>Rs. 32,000</td>
                  <td><span className="paid">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dashboard-footer">
          © 2026 Crow.lk. All rights reserved.
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
