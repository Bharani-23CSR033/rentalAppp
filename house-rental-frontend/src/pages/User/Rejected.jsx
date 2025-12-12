import "./User.css";
import { useEffect, useContext } from "react";
import { HouseContext } from "../../context/HouseContext";
import { Link } from "react-router-dom";

export default function Rejected() {
  const { rejectedHouses, loading, fetchRejectedHouses } = useContext(HouseContext);

  useEffect(() => {
    fetchRejectedHouses();
  }, []);

  return (
    <div className="user-page">
      <div className="page-header">
        <h1>🚫 Rejected Requests</h1>
        <p>Properties where your request was declined</p>
      </div>

      {loading && <div className="loading-spinner">Loading rejected properties...</div>}

      {!loading && rejectedHouses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <h3>No Rejected Requests</h3>
          <p>Great! You don't have any rejected requests. Keep exploring!</p>
          <Link to="/user/dashboard" className="back-link">
            Browse More Properties →
          </Link>
        </div>
      )}

      {!loading && rejectedHouses.length > 0 && (
        <>
          <div className="rejected-count">
            <span>⚠️ {rejectedHouses.length} rejected request(s)</span>
          </div>
          <div className="rejected-grid">
            {rejectedHouses.map((request) => (
              <div key={request._id} className="rejected-card">
                {request.houseId && (
                  <>
                    {request.houseId.photos && request.houseId.photos[0] && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${request.houseId.photos[0]}`}
                        alt={request.houseId.title}
                        className="house-image"
                      />
                    )}

                    <div className="rejected-card-body">
                      <h3>{request.houseId.title}</h3>

                      <div className="card-meta">
                        <span>📍 {request.houseId.location}</span>
                        <span>💰 ₹{request.houseId.cost}/month</span>
                      </div>

                      <p className="card-description">
                        {request.houseId.description?.substring(0, 100)}...
                      </p>

                      <div className="rejection-info">
                        <span className="status-rejected">Request Rejected</span>
                        <p className="rejection-date">
                          On: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="card-actions">
                        <button className="reapply-btn">
                          ♻️ Request Again
                        </button>
                        <button className="view-btn">
                          👁️ View Details
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <Link to="/user/dashboard" className="back-link">
        ← Back to Browse Properties
      </Link>
    </div>
  );
}
