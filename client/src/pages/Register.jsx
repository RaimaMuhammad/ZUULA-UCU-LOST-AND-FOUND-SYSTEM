
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import character from "../assets/hero.png";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentNumber: "",
    role: "student",
    adminCode: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setFormData((previous) => ({
      ...previous,
      role,
      email: "",
      studentNumber: "",
      adminCode: "",
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError(
        formData.role === "admin"
          ? "Please enter your administrator email."
          : "Please enter your student email."
      );
      return;
    }

    if (!formData.studentNumber.trim()) {
      setError(
        formData.role === "admin"
          ? "Please enter your administrator number."
          : "Please enter your student number."
      );
      return;
    }

    if (formData.role === "admin" && !formData.adminCode.trim()) {
      setError("Please enter the administrator registration code.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const { confirmPassword, ...userData } = formData;

      const response = await register(userData);

      setSuccess("Account created successfully.");

      const registeredRole = response?.user?.role || userData.role;

      navigate(
        registeredRole === "admin" ? "/admin" : "/home",
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = formData.role === "admin";

  return (
    <main className="register-page">
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

      <section className="register-main">
        <div className="register-content">
          <div className="register-heading">
            <span className="register-eyebrow">GET STARTED</span>
            <h1>Create an Account</h1>
            <p>Join the UCU Campus Lost &amp; Found community.</p>
          </div>

          <div className="register-tabs">
            <div className="register-tab active">Sign Up</div>
            <Link to="/login" className="register-tab">
              Log In
            </Link>
          </div>

          {error && (
            <p role="alert" className="register-error">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="register-success">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={150}
              autoComplete="name"
              required
            />

            <fieldset className="account-type-fieldset">
              <legend>Choose Account Type</legend>

              <div className="account-type-options">
                <label
                  className={`account-type-card ${
                    !isAdmin ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={!isAdmin}
                    onChange={handleRoleChange}
                  />

                  <span className="account-type-indicator"></span>

                  <span className="account-type-details">
                    <strong>Student Account</strong>
                  </span>
                </label>

                <label
                  className={`account-type-card ${
                    isAdmin ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={isAdmin}
                    onChange={handleRoleChange}
                  />

                  <span className="account-type-indicator"></span>

                  <span className="account-type-details">
                    <strong>Administrator Account</strong>
                  </span>
                </label>
              </div>
            </fieldset>

            <label htmlFor="email">
              {isAdmin ? "Administrator Email" : "Student Email"}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder={
                isAdmin
                  ? "Enter your administrator email"
                  : "Enter your UCU student email"
              }
              value={formData.email}
              onChange={handleChange}
              maxLength={150}
              autoComplete="email"
              required
            />

            <label htmlFor="studentNumber">
              {isAdmin ? "Administrator Number" : "Student Number"}
            </label>

            <input
              id="studentNumber"
              name="studentNumber"
              type="text"
              placeholder={
                isAdmin
                  ? "Enter your administrator number"
                  : "Enter your student number"
              }
              value={formData.studentNumber}
              onChange={handleChange}
              maxLength={50}
              required
            />

            {isAdmin && (
              <div className="admin-code-field">
                <label htmlFor="adminCode">
                  Administrator Registration Code
                </label>

                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  placeholder="Enter your special administrator code"
                  value={formData.adminCode}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />

                <small>
                  Enter the special code provided to authorised administrators.
                </small>
              </div>
            )}

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <button
              type="submit"
              className="register-submit"
              disabled={submitting}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="register-login-prompt">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
