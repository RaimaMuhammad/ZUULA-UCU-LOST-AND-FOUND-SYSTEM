
import { Link } from "react-router-dom";
import character from "../assets/hero.png";

export default function Welcome() {
  return (
    <main className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-logo">
          <img src="/zuula-logo.png" alt="ZUULA" />
        </div>

        <div className="welcome-character">
          <img src={character} alt="ZUULA character" />
        </div>

        <div className="welcome-description">
          <h1>UCU Campus Lost &amp; Found System</h1>
          <p>Report. Search. Claim.</p>
        </div>

        <div className="welcome-actions">
          <Link to="/register" className="welcome-button welcome-signup">
            Sign Up
          </Link>

          <Link to="/login" className="welcome-button welcome-login">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
