import { Link, useParams } from "react-router-dom";

export default function SubmitClaim() {
  const { id } = useParams();

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="submit-claim-page">
      <div className="breadcrumb">
        <Link to="/home">Home</Link> / <Link to="/search">Explore</Link> / Submit Claim
      </div>

      <h1>Submit a Claim</h1>
      <p>Provide details to help verify that this item belongs to you.</p>

      <div className="claim-item-summary">
        <div className="claim-item-image">Item Image</div>
        <div>
          <h3>Blue Water Bottle</h3>
          <p>Found Item · Ham Mukasa Library</p>
        </div>
      </div>

      <form className="claim-form" onSubmit={handleSubmit}>
        <label>Proof of Ownership</label>
        <textarea
          rows="5"
          placeholder="Describe unique features or identifying details that prove this item belongs to you..."
          required
        />

        <label>Additional Evidence (Optional)</label>
        <input type="file" accept="image/*" />

        <div className="private-information-notice">
          <strong>Privacy Notice</strong>
          <p>
            Your claim evidence is private. It will only be accessible to you
            and authorised administrators reviewing your claim.
          </p>
        </div>

        <button type="submit" className="primary-button">
          Submit Claim
        </button>

        <Link to={`/items/${id}`} className="cancel-link">
          Cancel
        </Link>
      </form>
    </div>
  );
}