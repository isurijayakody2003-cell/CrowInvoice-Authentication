
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import crowLogo from "../assets/Logo.jpg";
import { registerUser } from "../services/Service";

function Register() {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Input validation
    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Name must not exceed 100 characters.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedEmail.length > 255) {
      setError("Email must not exceed 255 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // API request
      const result = await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password: password,
        password_confirmation: confirmPassword,
      });

      // Handle API response
      if (result.success) {
        setSuccess(
          result.message || "Account created successfully!"
        );

        navigate(result.data?.redirectTo || "/dashboard");
      } else {
        const firstError = Object.values(
          result.errors || {}
        ).flat()[0];

        setError(
          firstError ||
          result.message ||
          "Registration failed."
        );
      }

    } catch (err) {
      // Error handling
      console.error("Registration error:", err);

      if (err.status === 409) {
        setError(
          err.message || "This email is already registered."
        );
      } else if (err.status === 422) {
        const firstError = Object.values(
          err.errors || {}
        ).flat()[0];

        setError(
          firstError || err.message ||
          "Please check your submitted details."
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      {/* Brand section */}
      <section className="register-brand">

        <div className="register-logo">
          <h1>Crow.lk</h1>
          <img src={crowLogo} alt="Crow.lk Logo" />
        </div>

        <div className="register-brand-content">
          <span>CROW INVOICE STUDIO</span>

          <h1>
            Start your
            <br />
            business journey
            <br />
            with CrowInvoice.
          </h1>

          <p>
            Create your account and experience a smarter
            way to manage your business invoices.
          </p>
        </div>
      </section>

      {/* Registration section */}
      <section className="register-panel">

        <div className="register-card">

          <span className="register-welcome">
            GET STARTED
          </span>

          <h1>Create your account</h1>

          <p className="register-subtitle">
            Join CrowInvoice and simplify your invoicing.
          </p>

          {/* Authentication tabs */}
          <div className="register-tabs">

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

            <button
              type="button"
              className="register-active-tab"
            >
              Create account
            </button>

          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} noValidate>

            <div className="register-form-group">
              <label htmlFor="name">Full name</label>

              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                maxLength={100}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email address</label>

              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                maxLength={255}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {/* Display messages */}
            {error && (
              <div className="register-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="register-success" role="status">
                {success}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account →"}
            </button>

          </form>

          <p className="register-footer">
            © 2026 Crow.lk. All rights reserved.
          </p>

        </div>
      </section>

    </div>
  );
}

export default Register;
