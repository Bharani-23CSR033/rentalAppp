import "./User.css";
import { useEffect, useContext } from "react";
import { HouseContext } from "../../context/HouseContext";
import { Link } from "react-router-dom";

export default function MyHouse() {
  const { myBookedHouse, loading, fetchMyBookedHouse } = useContext(HouseContext);

  useEffect(() => {
    fetchMyBookedHouse();
  }, []);

  return (
    <div className="user-page">
      <div className="page-header">
        <h1>🏡 Your Booked Property</h1>
        <p>Details of your confirmed booking</p>
      </div>

      {loading && <div className="loading-spinner">Loading your booking...</div>}

      {!loading && !myBookedHouse && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Booked Property Yet</h3>
          <p>You don't have any confirmed bookings at the moment.</p>
          <Link to="/user/dashboard" className="back-link">
            Browse Available Properties →
          </Link>
        </div>
      )}

      {!loading && myBookedHouse && (
        <div className="booked-house-card">
          {myBookedHouse.photos && myBookedHouse.photos[0] && (
            <img
              src={`${import.meta.env.VITE_API_URL}${myBookedHouse.photos[0]}`}
              alt={myBookedHouse.title}
              className="house-image"
            />
          )}

          <div className="house-details-container">
            <h2>{myBookedHouse.title}</h2>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">📍 Location</span>
                <span className="detail-value">{myBookedHouse.location}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">💰 Monthly Cost</span>
                <span className="detail-value">₹{myBookedHouse.cost}/month</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">🛋️ Furnishing</span>
                <span className="detail-value">{myBookedHouse.furnishing || 'N/A'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">✅ Status</span>
                <span className="detail-value status-booked">Booked</span>
              </div>
            </div>

            {myBookedHouse.description && (
              <div className="description-section">
                <h3>📝 Description</h3>
                <p>{myBookedHouse.description}</p>
              </div>
            )}

            {myBookedHouse.ownerId && (
              <div className="owner-section">
                <h3>👤 Owner Details</h3>
                <p><strong>Name:</strong> {myBookedHouse.ownerId.name}</p>
                <p><strong>Email:</strong> {myBookedHouse.ownerId.email}</p>
              </div>
            )}

            <Link to="/user/dashboard" className="back-link">
              ← Back to Browse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
