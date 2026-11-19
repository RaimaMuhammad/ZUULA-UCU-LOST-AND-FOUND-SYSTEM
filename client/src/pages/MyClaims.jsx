import { Link } from "react-router-dom";

export default function MyClaims() {
  const claims = [
    {
      id: 1,
      item: "Blue Water Bottle",
      date: "18 Nov 2026",
      status: "Pending",
      response: "Awaiting administrator review",
    },
    {
      id: 2,
      item: "Set of Keys",
      date: "15 Nov 2026",
      status: "Approved",
      response: "Your claim has been approved",
    },
    {
      id: 3,
      item: "Black Backpack",
      date: "10 Nov 2026",
      status: "Rejected",
      response: "The provided evidence did not match",
    },
  ];

  return (
    <div className="my-claims-page">
      <h1>My Claims</h1>
      <p>Track the progress of items you have claimed.</p>

      <div className="claims-list">
        {claims.map((claim) => (
          <article className="claim-card" key={claim.id}>
            <div className="claim-card-information">
              <h3>{claim.item}</h3>
              <p>Submitted: {claim.date}</p>
              <span className={`claim-status ${claim.status.toLowerCase()}`}>
                {claim.status}
              </span>
              <p>{claim.response}</p>
            </div>

            {claim.status === "Approved" && (
              <p className="claim-next-step">
                Contact the administrator about collecting your item.
              </p>
            )}
          </article>
        ))}
      </div>

      <Link to="/search" className="secondary-button">
        Explore More Items
      </Link>
    </div>
  );
}