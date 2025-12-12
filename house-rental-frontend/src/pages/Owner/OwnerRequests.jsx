import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import RequestCard from "../../components/RequestCard/RequestCard";
import "./Owner.css";
import { toast } from "react-toastify";

export default function OwnerRequests() {
  const [houseList, setHouseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [requests, setRequests] = useState([]);

  const fetchMyHouses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/owner/house/my");
      setHouseList(res.data.houses || []);
      // choose first house by default
      if (res.data.houses?.length) {
        setSelectedHouseId(res.data.houses[0]._id);
      }
    } catch (err) {
      toast.error("Failed to load houses");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (houseId) => {
    if (!houseId) { setRequests([]); return; }
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/owner/house/requests/${houseId}`);
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHouses();
  }, []);

  useEffect(() => {
    if (selectedHouseId) fetchRequests(selectedHouseId);
  }, [selectedHouseId]);

  const handleAccept = async (request) => {
    try {
      await axiosInstance.post("/owner/house/accept", { houseId: request.houseId || request.house, userId: request.userId._id || request.user });
      toast.success("Accepted booking");
      fetchRequests(selectedHouseId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async (request) => {
    try {
      await axiosInstance.post("/owner/house/reject", { houseId: request.houseId || request.house, userId: request.userId._id || request.user });
      toast.info("Rejected booking");
      fetchRequests(selectedHouseId);
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  return (
    <div className="container fade-in">
      <h2 className="page-title">Manage Requests</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <select value={selectedHouseId || ""} onChange={(e) => setSelectedHouseId(e.target.value)} style={{ padding: 10, borderRadius: 8 }}>
          <option value="">-- Select House --</option>
          {houseList.map((h) => (
            <option key={h._id} value={h._id}>{h.title} — {h.location}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && requests.length === 0 && <p>No requests for this house.</p>}

      {requests.map((r) => (
        <RequestCard key={r._id} request={r} onAccept={handleAccept} onReject={handleReject} />
      ))}
    </div>
  );
}
