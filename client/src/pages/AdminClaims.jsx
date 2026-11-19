import { Link } from "react-router-dom";
import { useState } from "react";

export default function AdminClaims() {
  const [filter, setFilter] = useState("All");

  const claims = [
    { id: 1, item: "Blue Water Bottle", claimant: "Jane Doe", date: "18 Nov 2026", status: "Pending" },
    { id: 2, item: "Set of Keys", claimant: "John Smith", date: "17 Nov 2026", status: "Pending" },
    { id: 3, item: "Black Backpack", claimant: "Mary Allen", date: "16 Nov 2026", status: "Approved" },
    { id: 4, item: "Calculator", claimant: "Peter James", date: "15 Nov 2026", status: "Rejected" },
  ];

  const filteredClaims = claims.filter(
    (claim) => filter === "All" || claim.status === filter
  );

  return (
    <div className="admin-claims-page">
      <h1>All Claims</h1>
      <p>Review and manage student ownership claims.</p>

      <div className="claim-filter-tabs">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            className={filter === status ? "active" : ""}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Claimant</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredClaims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.item}</td>
                <td>{claim.claimant}</td>
                <td>{claim.date}</td>
                <td>{claim.status}</td>
                <td>
                  <Link to={`/admin/claims/${claim.id}`}>
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}