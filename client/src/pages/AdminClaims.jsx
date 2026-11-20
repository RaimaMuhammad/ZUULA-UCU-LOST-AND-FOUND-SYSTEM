import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminClaims() {
  const [filter, setFilter] = useState("Pending");

  const claims = [
    {
      id: 1,
      item: "Set of Keys",
      claimant: "Jane Doe",
      studentId: "2026-00001",
      date: "18 Nov 2026",
      status: "Pending",
      image: "/uploads/keys.jpg",
    },
    {
      id: 2,
      item: "Yellow Water Bottle",
      claimant: "John Smith",
      studentId: "2026-00002",
      date: "17 Nov 2026",
      status: "Pending",
      image: "/uploads/phone.jpg",
    },
    {
      id: 3,
      item: "Black Backpack",
      claimant: "Mary Allen",
      studentId: "2026-00003",
      date: "16 Nov 2026",
      status: "Rejected",
      image: "/uploads/bag.jpg",
    },
    {
      id: 4,
      item: "Laptop",
      claimant: "Peter James",
      studentId: "2026-00004",
      date: "15 Nov 2026",
      status: "Approved",
      image: "/uploads/laptop.jpg",
    },
  ];

  const filteredClaims = claims.filter(
    (claim) => claim.status === filter
  );

  return (
    <div className="admin-page">

      <div className="admin-page-heading">
        <div>
          <h1>All Claims</h1>
          <p>
            Review and manage ownership claims submitted by students.
          </p>
        </div>
      </div>

      {/* CLAIM STATUS FILTERS */}
      <div className="admin-filter-tabs">

        {["Pending", "Rejected", "Approved"].map((status) => (
          <button
            key={status}
            className={filter === status ? "active" : ""}
            onClick={() => setFilter(status)}
          >
            {status}
            <span>
              {claims.filter((claim) => claim.status === status).length}
            </span>
          </button>
        ))}

      </div>

      {/* CLAIMS */}
      <section className="admin-claims-list">

        {filteredClaims.length > 0 ? (

          filteredClaims.map((claim) => (
            <article className="admin-claim-card" key={claim.id}>

              <img
                src={claim.image}
                alt={claim.item}
                className="admin-item-thumbnail"
              />

              <div className="admin-claim-details">

                <h3>{claim.item}</h3>

                <p>
                  Claimant: {claim.claimant}
                </p>

                <small>
                  Student ID: {claim.studentId}
                </small>

                <small>
                  Submitted: {claim.date}
                </small>

              </div>

              <span className={`admin-status ${claim.status.toLowerCase()}`}>
                {claim.status}
              </span>

              <Link
                to={`/admin/review-claim/${claim.id}`}
                className="admin-primary-button"
              >
                {claim.status === "Pending" ? "Review claim" : "View claim"}
              </Link>

            </article>
          ))

        ) : (

          <div className="admin-empty-state">
            <h3>No {filter.toLowerCase()} claims</h3>
            <p>There are currently no claims in this category.</p>
          </div>

        )}

      </section>

    </div>
  );
}