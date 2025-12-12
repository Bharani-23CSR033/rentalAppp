import "./User.css";
import { useEffect, useContext } from "react";
import { HouseContext } from "../../context/HouseContext";
import HouseCard from "../../components/HouseCard/HouseCard";

export default function UserDashboard() {
  const { houses, loading, fetchAvailableHouses, requestHouse } = useContext(HouseContext);

  useEffect(() => {
    fetchAvailableHouses();
  }, []);

  const handleSelectHouse = async (houseId) => {
    try {
      await requestHouse(houseId);
      await fetchAvailableHouses();
    } catch (err) {
      console.error("Failed to request house:", err);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>🏘️ Browse Available Properties</h1>
        <p>Find your perfect home from our collection of properties</p>
      </div>

      {loading && <div className="loading-spinner">Loading properties...</div>}

      {!loading && houses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No Properties Available</h3>
          <p>Check back later for new listings!</p>
        </div>
      )}

      {!loading && houses.length > 0 && (
        <>
          <div className="houses-count">
            <span>📊 Showing {houses.length} available properties</span>
          </div>
          <div className="houses-grid">
            {houses.map((house) => (
              <HouseCard
                key={house._id}
                house={house}
                onSelectHouse={handleSelectHouse}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
