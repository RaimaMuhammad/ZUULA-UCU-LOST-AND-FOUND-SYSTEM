
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-label">ZUULA CAMPUS LOST AND FOUND</span>

        <h1>404</h1>

        <div className="not-found-divider"></div>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for could not be found.
          It may have been moved or the link may be incorrect.
        </p>

        <Link to="/" className="not-found-button">
          Return to Welcome Page
        </Link>
      </div>
    </main>
  );
}
