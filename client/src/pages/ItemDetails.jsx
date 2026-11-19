import { Link, useParams } from "react-router-dom";

export default function ItemDetails() {
  const { id } = useParams();

  // Temporary display data. Replace with the selected item from your API later.
  const item = {
    name: "Blue Water Bottle",
    category: "Bottles",
    type: "Found Item",
    location: "Ham Mukasa Library",
    date: "18 November 2026",
    description:
      "A blue water bottle reported at the university library.",
    status: "Available",
  };

  return (
    <div className="item-details-page">
      <div className="breadcrumb">
        <Link to="/home">Home</Link> / <Link to="/search">Explore</Link> / Item Details
      </div>

      <div className="item-details-layout">
        <div className="item-details-image">Item Image</div>

        <section className="item-details-information">
          <span className="item-status">{item.status}</span>

          <h1>{item.name}</h1>

          <p>{item.type}</p>

          <div className="item-information-list">
            <div>
              <span>Category</span>
              <strong>{item.category}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{item.location}</strong>
            </div>

            <div>
              <span>Date Reported</span>
              <strong>{item.date}</strong>
            </div>
          </div>

          <h3>Description</h3>
          <p>{item.description}</p>

          <Link to={`/submit-claim/${id}`} className="primary-button">
            Claim This Item
          </Link>
        </section>
      </div>
    </div>
  );
}