import { Link } from "react-router-dom";

export default function Register() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="auth-heading">
          <h1>Create an Account</h1>
          <p>Join the UCU Campus Lost &amp; Found community.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" required />

          <label>Student Email</label>
          <input
            type="email"
            placeholder="Enter your UCU email"
            required
          />

          <label>Student Number</label>
          <input type="text" placeholder="Enter your student number" required />

          <label>Password</label>
          <input type="password" placeholder="Create a password" required />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" required />

          <button type="submit" className="primary-button">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </section>
    </main>
  );
}