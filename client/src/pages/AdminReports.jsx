import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminReports() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: 1,
      item: "Pink Backpack",
      category: "Bags",
      type: "Lost",
      reporter: "Jane Doe",
      date: "18 Nov 2026",
      status: "Open",
      image: "/uploads/bag.jpg",
    },
    {
      id: 2,
      item: "Set of Keys",
      category: "Personal Items",
      type: "Found",
      reporter: "John Smith",
      date: "17 Nov 2026",
      status: "Open",
      image: "/uploads/keys.jpg",
    },
    {
      id: 3,
      item: "Black Laptop",
      category: "Electronics",
      type: "Lost",
      reporter: "Mary Allen",
      date: "16 Nov 2026",
      status: "Returned",
      image: "/uploads/laptop.jpg",
    },
    {
      id: 4,
      item: "Water Bottle",
      category: "Accessories",
      type: "Found",
      reporter: "Peter James",
      date: "15 Nov 2026",
      status: "Open",
      image: "/uploads/phone.jpg",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesFilter =
      filter === "All" || report.status === filter;

    const matchesSearch =
      report.item.toLowerCase().includes(search.toLowerCase()) ||
      report.reporter.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-page">

      <div className="admin-page-heading">
        <div>
          <h1>All Reports</h1>
          <p>View and manage all lost and found item reports.</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="admin-filter-tabs">
        {["All", "Open", "Returned"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={filter === item ? "active" : ""}
          >
            {item}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="admin-search-bar">
        <span>⌕</span>
        <input
          type="search"
          placeholder="Search for an item or reporter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* REPORT LIST */}
      <section className="admin-reports-list">

        <div className="admin-list-heading">
          <h2>Reported Items</h2>
          <span>{filteredReports.length} reports</span>
        </div>

        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <article className="admin-report-card" key={report.id}>

              <img
                src={report.image}
                alt={report.item}
                className="admin-item-thumbnail"
              />

              <div className="admin-report-information">
                <h3>{report.item}</h3>

                <p>{report.category}</p>

                <small>
                  Reported by {report.reporter}
                </small>

                <small>{report.date}</small>
              </div>

              <div className="admin-report-meta">
                <span className={`admin-status ${report.type.toLowerCase()}`}>
                  {report.type}
                </span>

                <span className={`admin-status ${
                  report.status === "Open" ? "pending" : "approved"
                }`}>
                  {report.status}
                </span>
              </div>

              <Link
                to={`/item/${report.id}`}
                className="admin-outline-button"
              >
                View
              </Link>

            </article>
          ))
        ) : (
          <div className="admin-empty-state">
            <h3>No reports found</h3>
            <p>Try changing your search or filter.</p>
          </div>
        )}

      </section>

    </div>
  );
}