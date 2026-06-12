import { useState } from "react";
import axios from "axios";

export default function PropertyCard({ property, token, onSave }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(
        "/api/saved",
        {
          propertyId: String(property.id),
          title: property.title,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          size: property.size,
          amenities: property.amenities || [],
          images: property.image_url ? [property.image_url] : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      onSave();
    } catch (err) {
      if (err.response?.status === 409) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const price = property.price
    ? property.price >= 10000000
      ? `₹${(property.price / 10000000).toFixed(1)} Cr`
      : `₹${(property.price / 100000).toFixed(0)} L`
    : "Price on request";

  return (
    <div className="property-card">
      {property.image_url && !imgError ? (
        <img
          src={property.image_url}
          alt={property.title}
          className="card-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="card-img-placeholder">🏠</div>
      )}

      <div className="card-body">
        <h3 className="card-title">{property.title}</h3>
        <p className="card-location">📍 {property.location}</p>
        <p className="card-price">{price}</p>

        <div className="card-meta">
          {property.bedrooms && <span>🛏 {property.bedrooms} Bed</span>}
          {property.bathrooms && <span>🚿 {property.bathrooms} Bath</span>}
          {property.size && <span>📐 {property.size}</span>}
        </div>

        {property.amenities?.length > 0 && (
          <div className="card-amenities">
            {property.amenities.map((a) => (
              <span key={a} className="amenity-tag">{a}</span>
            ))}
          </div>
        )}

        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
          disabled={saving || saved}
        >
          {saved ? "❤️ Saved" : saving ? "Saving..." : "🤍 Save"}
        </button>
      </div>
    </div>
  );
}
