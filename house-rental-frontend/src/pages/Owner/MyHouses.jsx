import "./Owner.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import HouseCard from "../../components/HouseCard/HouseCard";

export default function MyHouses() {
  const [houses, setHouses] = useState([]);

  const fetchHouses = async () => {
    const res = await axiosInstance.get("/owner/house/my");
    setHouses(res.data.houses);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  return (
    <div className="container fade-in">
      <h2 className="page-title">My Houses</h2>

      {houses.length === 0 && <p>You haven't posted any houses yet.</p>}

      {houses.map((house) => (
        <HouseCard key={house._id} house={house} />
      ))}
    </div>
  );
}
