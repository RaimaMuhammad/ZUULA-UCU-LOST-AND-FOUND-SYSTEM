
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (
      formData.password !== formData.confirmPassword
    ) {
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

      await register(userData);

      setSuccess("Account created successfully.");

      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="auth-heading">
          <h1>Create an Account</h1>
          <p>
            Join the UCU Campus Lost &amp; Found community.
          </p>
        </div>

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="auth-success">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <label htmlFor="email">Student Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your UCU email"
            value={formData.email}
            onChange={handleChange}
            maxLength={150}
            autoComplete="email"
            required
          />

          <label htmlFor="studentNumber">Student Number</label>
          <input
            id="studentNumber"
            name="studentNumber"
            type="text"
            placeholder="Enter your student number"
            value={formData.studentNumber}
            onChange={handleChange}
            maxLength={50}
            required
          />

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

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>
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
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Log In</Link>
        </p>
      </section>
    </main>
  );
}
