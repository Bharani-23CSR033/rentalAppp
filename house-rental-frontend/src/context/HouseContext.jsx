import { createContext, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export const HouseContext = createContext();

export const HouseProvider = ({ children }) => {
  // ===========================
  // GLOBAL STATES
  // ===========================
  const [houses, setHouses] = useState([]); // all available houses (User)
  const [ownerHouses, setOwnerHouses] = useState([]); // owner's houses
  const [myBookedHouse, setMyBookedHouse] = useState(null); // user's booked house
  const [rejectedHouses, setRejectedHouses] = useState([]); // user's rejected houses
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalHouses: 0, pendingRequests: 0, acceptedBookings: 0 });

  // ===========================
  // FETCH ALL AVAILABLE HOUSES (USER)
  // ===========================
  const fetchAvailableHouses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/houses");
      setHouses(res.data.houses || []);
      return res.data.houses || [];
    } catch (err) {
      toast.error("Failed to load houses");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================
  // FETCH OWNER HOUSES
  // ===========================
  const fetchOwnerHouses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/owner/house");
      setOwnerHouses(res.data.houses || []);
      
      // Calculate stats
      const totalHouses = res.data.houses?.length || 0;
      const pendingRequests = res.data.houses?.reduce((acc, h) => acc + (h.requests?.length || 0), 0) || 0;
      const acceptedBookings = res.data.houses?.filter(h => h.acceptedUser).length || 0;
      
      setStats({ totalHouses, pendingRequests, acceptedBookings });
      return res.data.houses || [];
    } catch (err) {
      toast.error("Could not load owner houses");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================
  // FETCH USER'S BOOKED HOUSE
  // ===========================
  const fetchMyBookedHouse = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/user/myhouse");
      setMyBookedHouse(res.data.bookedHouse || null);
      return res.data.bookedHouse;
    } catch (err) {
      console.error("Failed to load booked house");
      return null;
    }
  }, []);

  // ===========================
  // FETCH REJECTED HOUSES
  // ===========================
  const fetchRejectedHouses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/user/rejected");
      setRejectedHouses(res.data.rejected || []);
      return res.data.rejected || [];
    } catch (err) {
      toast.error("Failed to load rejected houses");
      return [];
    }
  }, []);

  // ===========================
  // CREATE HOUSE (OWNER)
  // ===========================
  const createHouse = useCallback(async (formData) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/owner/house", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("✅ House posted successfully!");
      await fetchOwnerHouses();
      return res.data.house;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add house";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOwnerHouses]);

  // ===========================
  // UPDATE HOUSE
  // ===========================
  const updateHouse = useCallback(async (houseId, formData) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(`/owner/house/${houseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("✅ House updated successfully!");
      await fetchOwnerHouses();
      return res.data.house;
    } catch (err) {
      toast.error("❌ Failed to update house");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOwnerHouses]);

  // ===========================
  // DELETE HOUSE
  // ===========================
  const deleteHouse = useCallback(async (houseId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/owner/house/${houseId}`);
      toast.success("✅ House deleted successfully");
      await fetchOwnerHouses();
    } catch (err) {
      const message = err.response?.data?.message || "Delete failed";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOwnerHouses]);

  // ===========================
  // GET SINGLE HOUSE (for details page)
  // ===========================
  const getSingleHouse = useCallback(async (houseId) => {
    try {
      const res = await axiosInstance.get(`/owner/house/${houseId}`);
      return res.data.house;
    } catch (err) {
      toast.error("Failed to load house details");
      throw err;
    }
  }, []);

  // ===========================
  // GET REQUESTS FOR A HOUSE
  // ===========================
  const getHouseRequests = useCallback(async (houseId) => {
    try {
      const res = await axiosInstance.get(`/owner/house/requests/${houseId}`);
      return res.data.requests || [];
    } catch (err) {
      toast.error("Failed to load requests");
      return [];
    }
  }, []);

  // ===========================
  // ACCEPT BOOKING REQUEST (OWNER)
  // ===========================
  const acceptBookingRequest = useCallback(async (houseId, userId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/owner/house/accept", { houseId, userId });
      toast.success("✅ Booking accepted!");
      await fetchOwnerHouses();
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to accept booking";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOwnerHouses]);

  // ===========================
  // REJECT BOOKING REQUEST (OWNER)
  // ===========================
  const rejectBookingRequest = useCallback(async (houseId, userId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/owner/house/reject", { houseId, userId });
      toast.success("✅ Booking rejected");
      await fetchOwnerHouses();
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reject booking";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOwnerHouses]);

  // ===========================
  // REQUEST HOUSE (USER)
  // ===========================
  const requestHouse = useCallback(async (houseId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/request", { houseId });
      toast.success("✅ Request sent successfully!");
      await fetchAvailableHouses();
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to request house";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAvailableHouses]);

  // ===========================
  // WITHDRAW REQUEST (USER)
  // ===========================
  const withdrawRequest = useCallback(async (houseId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/user/request/${houseId}`);
      toast.success("✅ Request withdrawn");
      await fetchAvailableHouses();
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to withdraw request";
      toast.error(`❌ ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAvailableHouses]);

  // ===========================
  // PROVIDER RETURN
  // ===========================
  return (
    <HouseContext.Provider
      value={{
        // States
        houses,
        ownerHouses,
        myBookedHouse,
        rejectedHouses,
        loading,
        stats,

        // User Functions
        fetchAvailableHouses,
        fetchMyBookedHouse,
        fetchRejectedHouses,
        requestHouse,
        withdrawRequest,

        // Owner Functions
        fetchOwnerHouses,
        createHouse,
        updateHouse,
        deleteHouse,
        getSingleHouse,
        getHouseRequests,
        acceptBookingRequest,
        rejectBookingRequest,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};
