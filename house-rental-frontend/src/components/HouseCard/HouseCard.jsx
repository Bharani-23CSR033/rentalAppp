import "./HouseCard.css";

export default function HouseCard({
  house,
  onSelectHouse,
  onWithdrawRequest,
  onEdit,
  onDelete,
}) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="house-card">
      <div className="house-image-wrapper">
        {house.photos && house.photos.length > 0 ? (
          <img
            src={`${apiUrl}${house.photos[0]}`}
            alt={house.title}
            className="house-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/320x200?text=No+Image";
            }}
          />
        ) : (
          <div className="house-image-placeholder">No Image</div>
        )}
        {!house.isAvailable && (
          <div className="house-badge unavailable">Unavailable</div>
        )}
        {house.isAvailable && (
          <div className="house-badge available">Available</div>
        )}
      </div>

      <div className="house-card-body">
        <h3 className="house-title">{house.title}</h3>

        <div className="house-meta">
          <span className="meta-item">
            <span className="meta-icon">📍</span> {house.location}
          </span>
          <span className="meta-item">
            <span className="meta-icon">💰</span> ₹{house.cost}/month
          </span>
        </div>

        {house.furnishing && (
          <div className="furnishing-tag">
            🛋️ {house.furnishing}
          </div>
        )}

        {house.description && (
          <p className="house-description">
            {house.description.substring(0, 100)}
            {house.description.length > 100 ? "..." : ""}
          </p>
        )}

        <div className="house-actions">
          {onSelectHouse && (
            <button
              className="action-btn btn-select"
              onClick={() => onSelectHouse(house._id)}
              disabled={!house.isAvailable}
            >
              {house.isAvailable ? "✓ Select" : "✗ Unavailable"}
            </button>
          )}

          {onWithdrawRequest && (
            <button
              className="action-btn btn-withdraw"
              onClick={() => onWithdrawRequest(house._id)}
            >
              ↩️ Withdraw
            </button>
          )}

          {onEdit && (
            <button
              className="action-btn btn-edit"
              onClick={() => onEdit(house._id)}
            >
              ✎ Edit
            </button>
          )}

          {onDelete && (
            <button
              className="action-btn btn-delete"
              onClick={() => onDelete(house._id)}
            >
              🗑️ Delete
            </button>
          )}
        </div>

        {house.acceptedUser && (
          <div className="accepted-badge">
            ✅ Booked by: {house.acceptedUser.name}
          </div>
        )}

        {house.requests && house.requests.length > 0 && (
          <div className="requests-badge">
            📬 {house.requests.length} request(s)
          </div>
        )}
      </div>
    </div>
  );
}
