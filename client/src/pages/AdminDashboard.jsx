import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const statistics = [
    { label: "Total Reports", value: 48 },
    { label: "Pending Claims", value: 12 },
    { label: "Approved Claims", value: 24 },
    { label: "Items Returned", value: 18 },
  ];

  const pendingClaims = [
    { id: 1, item: "Blue Water Bottle", student: "Jane Doe", date: "18 Nov 2026" },
    { id: 2, item: "Set of Keys", student: "John Smith", date: "17 Nov 2026" },
    { id: 3, item: "Black Backpack", student: "Mary Allen", date: "16 Nov 2026" },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Administrator Dashboard</h1>
      <p>Overview of lost and found activities at UCU.</p>

      <section className="admin-statistics">
        {statistics.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="admin-pending-section">
        <div className="section-heading">
          <h2>Claims Requiring Attention</h2>
          <Link to="/admin/claims">View All</Link>
        </div>

        <div className="admin-pending-list">
          {pendingClaims.map((claim) => (
            <article className="admin-pending-card" key={claim.id}>
              <div>
                <h3>{claim.item}</h3>
                <p>Claimant: {claim.student}</p>
                <small>Submitted: {claim.date}</small>
              </div>

              <Link to={`/admin/claims/${claim.id}`}>
                Review Claim
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}