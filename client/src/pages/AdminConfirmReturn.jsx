import { Link, useParams } from "react-router-dom";

export default function AdminConfirmReturn() {
  const { id } = useParams();

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="confirm-return-page">
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link> / Confirm Return
      </div>

      <h1>Confirm Item Return</h1>

      <p>
        Record the physical handover of an approved item to its rightful owner.
      </p>

      <div className="return-item-summary">
        <h2>Set of Keys</h2>
        <p>Claim status: Approved</p>
        <p>Claimant: Jane Doe</p>
      </div>

      <form className="return-confirmation-form" onSubmit={handleSubmit}>
        <label>Return Date</label>
        <input type="date" required />

        <label>Confirmation Notes</label>
        <textarea
          rows="4"
          placeholder="Enter any relevant details about the handover..."
        />

        <button type="submit" className="primary-button">
          Confirm Item Returned
        </button>
      </form>

      <p>Report Reference: {id}</p>
    </div>
  );
}