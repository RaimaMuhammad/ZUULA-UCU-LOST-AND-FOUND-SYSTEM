
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import character from "../assets/hero.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await login(formData);

      if (response.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="register-page">

      {/* LEFT BRANDING PANEL */}
      <aside className="register-brand-panel">

        <img
          src="/zuula-logo.png"
          alt="ZUULA Logo"
          className="register-brand-logo"
        />

        <img
          src={character}
          alt="ZUULA Illustration"
          className="register-character"
        />

        <div className="register-brand-text">
          <h3>UCU Campus Lost &amp; Found System</h3>

          <p>Report.Search.Claim</p>
        </div>

      </aside>

      {/* RIGHT LOGIN PANEL */}
      <section className="register-main">
        <div className="register-content">

          {/* PAGE HEADING */}
          <div className="register-heading">
            <span className="register-eyebrow">
              WELCOME BACK
            </span>

            <h1>Log In</h1>

            <p>
              Access your UCU Campus Lost &amp; Found account.
            </p>
          </div>

          {/* SIGN UP AND LOG IN CARDS */}
          <div className="register-tabs">

            <Link
              to="/register"
              className="register-tab"
            >
              Sign Up
            </Link>

            <div className="register-tab active">
              Log In
            </div>

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p role="alert" className="register-error">
              {error}
            </p>
          )}

          {/* LOGIN FORM */}
          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            {/* FORGOT PASSWORD */}
            <div className="login-forgot-password">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="register-submit"
              disabled={submitting}
            >
              {submitting ? "Logging In..." : "Log In"}
            </button>

          </form>

          {/* REGISTER PROMPT */}
          <p className="register-login-prompt">
            Don't have an account?{" "}
            <Link to="/register">Sign Up</Link>
          </p>

        </div>
      </section>

    </main>
  );
}
