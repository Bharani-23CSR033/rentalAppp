import "./Owner.css";
import { useContext, useEffect } from "react";
import { HouseContext } from "../../context/HouseContext";
import DashboardStats from "../../components/DashboardStats/DashboardStats";
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
  const { stats, loading, fetchOwnerHouses } = useContext(HouseContext);

  useEffect(() => {
    fetchOwnerHouses();
  }, []);

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h1>🏠 Property Owner Dashboard</h1>
        <p>Manage your properties and booking requests</p>
      </div>

      {loading && <div className="loading-spinner">Loading...</div>}

      {!loading && (
        <>
          <DashboardStats stats={[
            { label: "📊 Total Houses", value: stats.totalHouses, color: "#667eea" },
            { label: "⏳ Pending Requests", value: stats.pendingRequests, color: "#f6ad55" },
            { label: "✅ Accepted Bookings", value: stats.acceptedBookings, color: "#48bb78" }
          ]} />

          <div className="dashboard-actions">
            <Link to="/owner/add" className="action-btn btn-primary">
              <span>➕</span> Add New Property
            </Link>
            <Link to="/owner/houses" className="action-btn btn-secondary">
              <span>📋</span> My Properties
            </Link>
            <Link to="/owner/requests" className="action-btn btn-tertiary">
              <span>📬</span> Booking Requests
            </Link>
          </div>

          <div className="dashboard-welcome">
            <h3>Welcome to Your Dashboard!</h3>
            <p>Here you can manage all your properties, track booking requests, and manage tenant bookings.</p>
            <ul className="feature-list">
              <li>✨ Post and manage multiple properties</li>
              <li>👥 Review and approve/reject tenant requests</li>
              <li>📊 Track your property performance</li>
              <li>🔔 Manage booking notifications</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
