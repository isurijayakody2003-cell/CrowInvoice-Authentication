
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import crowLogo from "../assets/Logo.jpg";
import { loginUser } from "../services/Service";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!validEmail.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser({
        email: email.trim(),
        password,
        remember,
      });

      if (result.success) {
        navigate(result.data?.redirectTo || "/dashboard", {
          replace: true,
        });
      } else {
        setError(result.message || "Login failed.");
      }

    } catch (err) {
      console.error("Login Submit Error:", err);

      if (err.status === 401) {
        setError("Incorrect email or password.");
      } else if (err.status === 422) {
        setError(err.message || "Please check your details.");
      } else if (err.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err.message || "Unable to connect to the server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">

        {/* BRAND SECTION */}

        <section className="Login Brand">
          <div className="Brand Logo">
            <h1>Crow.lk</h1>
            <img src={crowLogo} alt="Crow.lk Logo" />
          </div>

          <div className="Brand-Container">
            <span className="Brand-Tag">
              CROW INVOICE STUDIO
            </span>

            <h1>
              Professional
              <br />
              invoices,
              <br />
              ready in minutes.
            </h1>

            <p>
              Simplify your invoicing process with a smarter way
              to create, organize and manage your business invoices.
              Less paperwork, more time to grow.
            </p>
          </div>
        </section>

        {/* LOGIN SECTION */}

        <section className="Login Panel">
          <div className="Login Card">

            <span className="welcome">WELCOME BACK</span>

            <h1>Sign in to your account</h1>

            <p className="Sub">
              Sign in to manage your invoices and keep
              your business moving.
            </p>

            <div className="auth-tabs">
              <button type="button" className="active-tab">
                Sign in
              </button>

              <button
                type="button"
                className="inactive-tab"
                onClick={() => navigate("/register")}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              <div className="form">
                <label htmlFor="Email">Email address</label>

                <input
                  type="email"
                  id="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form">
                <label htmlFor="Password">Password</label>

                <input
                  type="password"
                  id="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <div className="Remember">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />

                <label htmlFor="remember">
                  Keep me signed in
                </label>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>

            </form>

            <p className="footer">
              ← Return to invoice editor
            </p>

          </div>
        </section>
      </div>

      {/* FOOTER */}

      <footer className="main-footer">
        <div className="footer-top">

          <div className="footer-brand">
            <img src={crowLogo} alt="Crow.lk Logo" />
          </div>

          <div className="footer-description">
            <p>
              A smarter digital experience, proudly crafted
              by <strong>Crow.lk</strong>.
            </p>
          </div>

        </div>

        <div className="footer-links">
          <a
            href="https://crow.lk"
            target="_blank"
            rel="noreferrer"
          >
            Crow.lk ↗
          </a>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Crow.lk. All rights reserved.</p>
          <span>Built for businesses that move forward.</span>
        </div>
      </footer>
    </>
  );
}

export default Login;
