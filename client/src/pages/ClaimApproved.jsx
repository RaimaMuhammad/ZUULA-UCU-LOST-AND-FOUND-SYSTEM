import { Link, useParams } from "react-router-dom";

export default function ClaimApproved() {
  const { id } = useParams();

  return (
    <div className="admin-page">

      <div className="admin-breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span>/</span>
        <Link to="/admin/claims">All Claims</Link>
        <span>/</span>
        <strong>Claim Approved</strong>
      </div>

      <div className="admin-success-container">

        <div className="admin-success-card">

          <div className="admin-success-icon">
            <svg
              width="65"
              height="65"
              viewBox="0 0 65 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="32.5"
                cy="32.5"
                r="27"
                stroke="#A51D55"
                strokeWidth="2"
              />

              <path
                d="M20 33L28 41L46 23"
                stroke="#A51D55"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1>Claim Approved!</h1>

          <h3>Successfully approved the claim!</h3>

          <p>
            The ownership claim has been successfully approved.
            The claimant can now proceed with arranging collection
            of the item.
          </p>

          <small>Claim Reference: #{id}</small>

          <Link
            to="/admin/claims"
            className="admin-success-button"
          >
            Done
          </Link>

        </div>

      </div>

    </div>
  );
}
