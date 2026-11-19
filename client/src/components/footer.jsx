import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>ZUULA</h3>
          <p>UCU Campus Lost and Found System</p>
        </div>

        <div className="footer-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/search">Browse Items</Link>
          <Link to="/report-item">Report an Item</Link>
          <Link to="/profile">My Profile</Link>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ZUULA. Uganda Christian University.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;