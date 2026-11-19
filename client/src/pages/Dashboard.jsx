import { Link } from "react-router-dom";

export default function Dashboard() {
  const recentItems = [
    { id: 1, name: "Blue Water Bottle", category: "Bottle", location: "Library", date: "18 Nov 2026" },
    { id: 2, name: "Black Laptop Bag", category: "Bags", location: "Lecture Room", date: "17 Nov 2026" },
    { id: 3, name: "Set of Keys", category: "Personal Items", location: "Cafeteria", date: "16 Nov 2026" },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <h1>Hello, Student</h1>
          <p>Have you lost something or found an item on campus?</p>
        </div>

        <Link to="/report-item" className="primary-button">
          Report an Item
        </Link>
      </section>

      <section className="dashboard-search">
        <h2>Find an Item</h2>
        <p>Search through items reported by the UCU community.</p>

        <form action="/search">
          <input
            type="search"
            name="q"
            placeholder="Search by item name, category or location..."
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="dashboard-categories">
        <div className="section-heading">
          <h2>Browse Categories</h2>
          <Link to="/search">View All</Link>
        </div>

        <div className="category-list">
          {["Electronics", "Bags", "Books", "Keys", "Clothing", "Other"].map(
            (category) => (
              <Link
                key={category}
                to={`/search?category=${category}`}
                className="category-item"
              >
                {category}
              </Link>
            )
          )}
        </div>
      </section>

      <section className="dashboard-recent">
        <div className="section-heading">
          <h2>Recently Reported Items</h2>
          <Link to="/search">See All</Link>
        </div>

        <div className="item-grid">
          {recentItems.map((item) => (
            <article className="item-card" key={item.id}>
              <div className="item-image">Item Image</div>
              <div className="item-card-content">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <p>{item.location} · {item.date}</p>
                <Link to={`/items/${item.id}`}>View Details</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}