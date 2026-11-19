import { Link } from "react-router-dom";

export default function MyReports() {
  const reports = [
    {
      id: 1,
      name: "Blue Water Bottle",
      type: "Found",
      category: "Bottles",
      date: "18 Nov 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Black Backpack",
      type: "Lost",
      category: "Bags",
      date: "15 Nov 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Scientific Calculator",
      type: "Lost",
      category: "Electronics",
      date: "10 Nov 2026",
      status: "Returned",
    },
  ];

  return (
    <div className="my-reports-page">
      <div className="page-heading">
        <div>
          <h1>My Reports</h1>
          <p>View and manage the items you have reported.</p>
        </div>

        <Link to="/report-item" className="primary-button">
          Report New Item
        </Link>
      </div>

      <div className="reports-list">
        {reports.map((report) => (
          <article className="report-card" key={report.id}>
            <div className="report-card-image">Item Image</div>

            <div className="report-card-information">
              <h3>{report.name}</h3>
              <p>{report.type} Item · {report.category}</p>
              <p>Reported: {report.date}</p>
              <span className={`report-status ${report.status.toLowerCase()}`}>
                {report.status}
              </span>
            </div>

            <div className="report-card-actions">
              <Link to={`/items/${report.id}`}>View</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}