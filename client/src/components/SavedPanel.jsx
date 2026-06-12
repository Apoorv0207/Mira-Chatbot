import axios from "axios";

export default function SavedPanel({ saved, token, onRefresh, onClose }) {
  const handleRemove = async (id) => {
    await axios.delete(`/api/saved/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onRefresh();
  };

  return (
    <div className="saved-panel">
      <div className="saved-header">
        <h2>❤️ Saved Properties</h2>
        <button className="close-btn" onClick={onClose}>← Back to Chat</button>
      </div>

      {saved.length === 0 ? (
        <p className="empty-msg">No saved properties yet. Start chatting to find homes!</p>
      ) : (
        <div className="saved-grid">
          {saved.map((p) => (
            <div key={p._id} className="property-card">
              {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="card-img" />}
              <div className="card-body">
                <h3 className="card-title">{p.title}</h3>
                <p className="card-location">📍 {p.location}</p>
                <p className="card-price">
                  {p.price >= 10000000
                    ? `₹${(p.price / 10000000).toFixed(1)} Cr`
                    : `₹${(p.price / 100000).toFixed(0)} L`}
                </p>
                <div className="card-meta">
                  {p.bedrooms && <span>🛏 {p.bedrooms} Bed</span>}
                  {p.bathrooms && <span>🚿 {p.bathrooms} Bath</span>}
                </div>
                <button className="remove-btn" onClick={() => handleRemove(p._id)}>
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
