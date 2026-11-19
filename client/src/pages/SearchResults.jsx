import { Link } from "react-router-dom";
import { useState } from "react";

export default function SearchResults() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [itemType, setItemType] = useState("All");

  const items = [
    { id: 1, name: "Blue Water Bottle", category: "Bottles", type: "Found", location: "Library", date: "18 Nov 2026" },
    { id: 2, name: "Black Laptop Bag", category: "Bags", type: "Found", location: "Lecture Room", date: "17 Nov 2026" },
    { id: 3, name: "Set of Keys", category: "Personal Items", type: "Found", location: "Cafeteria", date: "16 Nov 2026" },
    { id: 4, name: "Scientific Calculator", category: "Electronics", type: "Lost", location: "Block A", date: "15 Nov 2026" },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    const matchesType = itemType === "All" || item.type === itemType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="search-results-page">
      <h1>Explore Items</h1>
      <p>Search for lost and found items around UCU.</p>

      <div className="search-filter-panel">
        <input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Bottles">Bottles</option>
          <option value="Bags">Bags</option>
          <option value="Personal Items">Personal Items</option>
          <option value="Electronics">Electronics</option>
        </select>

        <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="All">All Items</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>
      </div>

      <p>{filteredItems.length} items found</p>

      <div className="item-grid">
        {filteredItems.map((item) => (
          <article className="item-card" key={item.id}>
            <div className="item-image">Item Image</div>
            <div className="item-card-content">
              <span>{item.type}</span>
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p>{item.location} · {item.date}</p>
              <Link to={`/items/${item.id}`}>View Details</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}