import { Link } from "react-router-dom";
import { useState } from "react";

export default function AdminReports() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const reports = [
    { id: 1, item: "Blue Water Bottle", type: "Found", category: "Bottles", owner: "Jane Doe", date: "18 Nov 2026", status: "Active" },
    { id: 2, item: "Black Backpack", type: "Lost", category: "Bags", owner: "John Smith", date: "17 Nov 2026", status: "Active" },
    { id: 3, item: "Set of Keys", type: "Found", category: "Personal Items", owner: "Mary Allen", date: "16 Nov 2026", status: "Claimed" },
    { id: 4, item: "Calculator", type: "Lost", category: "Electronics", owner: "Peter James", date: "15 Nov 2026", status: "Returned" },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.item.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === "All" || report.type === type;

    return matchesSearch && matchesType;
  });

  return (
    <div className="admin-reports-page">
      <h1>All Reports</h1>
      <p>View and manage all lost and found item reports.</p>

      <div className="admin-filter-bar">
        <input
          type="search"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All Report Types</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Category</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>{report.item}</td>
                <td>{report.type}</td>
                <td>{report.category}</td>
                <td>{report.owner}</td>
                <td>{report.date}</td>
                <td>{report.status}</td>
                <td>
                  <Link to={`/items/${report.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}