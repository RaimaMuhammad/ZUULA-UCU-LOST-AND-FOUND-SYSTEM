import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  const statistics = [
    { label: "Total Reports", value: 14, icon: "📋", color: "blue" },
    { label: "Total Claims", value: 21, icon: "📨", color: "purple" },
    { label: "Approved", value: 10, icon: "✓", color: "green" },
    { label: "Pending", value: 11, icon: "◷", color: "orange" },
  ];

  const pendingClaims = [
    {
      id: 1,
      item: "Set of Keys",
      claimant: "Jane Doe",
      studentId: "2026-00001",
      date: "18 Nov 2026",
      image: "/uploads/keys.jpg",
      status: "Pending",
    },
    {
      id: 2,
      item: "Yellow Water Bottle",
      claimant: "John Smith",
      studentId: "2026-00002",
      date: "17 Nov 2026",
      image: "/uploads/3272c7de-d7cc-4580-9fe8-06dd585e0c81.jpeg",
      status: "Pending",
    },
  ];

  return (
    <div className="admin-page">

      <div className="admin-welcome">
        <div>
          <h1>Administrator Overview</h1>
          <p>
            Welcome back, {user?.fullName || user?.name || "Administrator"}.
            Here is what's happening with ZUULA today.
          </p>
        </div>

        <div className="admin-date">
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* STATISTICS */}
      <section className="admin-statistics">

        {statistics.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>

            <div>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          </article>
        ))}

      </section>

      {/* PENDING CLAIMS */}
      <section className="admin-section">

        <div className="admin-section-heading">
          <div>
            <h2>Need your attention</h2>
            <p>Claims waiting for administrator review.</p>
          </div>

          <Link to="/admin/claims" className="admin-view-all">
            View all
          </Link>
        </div>

        <div className="admin-pending-list">

          {pendingClaims.map((claim) => (
            <article className="admin-pending-card" key={claim.id}>

              <img
                src={claim.image}
                alt={claim.item}
                className="admin-item-thumbnail"
              />

              <div className="admin-pending-details">
                <h3>{claim.item}</h3>
                <p>Claimant: {claim.claimant}</p>
                <small>Submitted: {claim.date}</small>
              </div>

              <span className="admin-status pending">
                {claim.status}
              </span>

              <Link
                to={`/admin/review-claim/${claim.id}`}
                className="admin-primary-button"
              >
                Review claim
              </Link>

            </article>
          ))}

        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="admin-quick-actions">
        <h2>Quick Actions</h2>

        <div className="admin-action-grid">

          <Link to="/admin/reports">
            <span>📋</span>
            <strong>View Reports</strong>
            <small>Manage lost and found reports</small>
          </Link>

          <Link to="/admin/claims">
            <span>📨</span>
            <strong>Manage Claims</strong>
            <small>Review student ownership claims</small>
          </Link>

        </div>
      </section>

    </div>
  );
}