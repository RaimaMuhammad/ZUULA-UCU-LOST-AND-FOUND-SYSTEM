import { useState } from "react";

export default function ReportItem() {
  const [reportType, setReportType] = useState("Lost");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="report-item-page">
      <h1>Report an Item</h1>
      <p>Provide information about the item you lost or found.</p>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="report-type-selection">
          <button
            type="button"
            className={reportType === "Lost" ? "selected" : ""}
            onClick={() => setReportType("Lost")}
          >
            I Lost an Item
          </button>

          <button
            type="button"
            className={reportType === "Found" ? "selected" : ""}
            onClick={() => setReportType("Found")}
          >
            I Found an Item
          </button>
        </div>

        <label>Item Name</label>
        <input type="text" placeholder="Enter item name" required />

        <label>Category</label>
        <select required defaultValue="">
          <option value="" disabled>Select category</option>
          <option>Electronics</option>
          <option>Bags</option>
          <option>Books</option>
          <option>Clothing</option>
          <option>Keys</option>
          <option>Other</option>
        </select>

        <label>Description</label>
        <textarea
          rows="4"
          placeholder="Describe the item..."
          required
        />

        <label>Date {reportType === "Lost" ? "Lost" : "Found"}</label>
        <input type="date" required />

        <label>Location</label>
        <select required defaultValue="">
          <option value="" disabled>Select campus location</option>
          <option>Library</option>
          <option>Lecture Room</option>
          <option>Student Centre</option>
          <option>Cafeteria</option>
          <option>Hostel</option>
          <option>Other</option>
        </select>

        <label>Upload Item Photo</label>
        <input type="file" accept="image/*" />

        {reportType === "Found" && (
          <div className="private-details-section">
            <h3>Private Item Details</h3>
            <p>
              These details will not appear in the public listing. They will
              help the administrator verify ownership claims.
            </p>

            <label>Additional Identifying Details</label>
            <textarea
              rows="4"
              placeholder="Describe unique marks, contents or other identifying details..."
            />
          </div>
        )}

        <button type="submit" className="primary-button">
          Submit Report
        </button>
      </form>
    </div>
  );
}