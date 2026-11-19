import { Link } from "react-router-dom";

export default function Login() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="auth-heading">
          <h1>Welcome Back</h1>
          <p>Log in to your ZUULA account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="primary-button">
            Log In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </section>
    </main>
  );
}