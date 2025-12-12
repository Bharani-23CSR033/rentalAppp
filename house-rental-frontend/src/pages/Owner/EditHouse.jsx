import "./Owner.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import HouseForm from "../../components/HouseForm/HouseForm";

export default function EditHouse() {
  const { id } = useParams(); // Get houseId from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    cost: "",
    description: "",
    location: "",
    furnishing: "Furnished",
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===========================
  // FETCH EXISTING HOUSE DETAILS
  // ===========================
  const fetchHouse = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/owner/house/my");
      const house = res.data.houses.find((h) => h._id === id);

      if (!house) {
        toast.error("House not found");
        navigate("/owner/houses");
        return;
      }

      setForm({
        title: house.title,
        cost: house.cost,
        description: house.description,
        location: house.location,
        furnishing: house.furnishing || "Furnished",
      });

    } catch (err) {
      toast.error("Failed to load house details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouse();
  }, []);

  // ===========================
  // HANDLE UPDATE SUBMIT
  // ===========================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.title || !form.cost || !form.location) {
      toast.error("Title, cost, and location are required");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    photos.forEach((file) => fd.append("photos", file));

    try {
      setLoading(true);
      await axiosInstance.put(`/owner/house/${id}`, fd);
      toast.success("House updated successfully!");
      navigate("/owner/houses");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2 className="page-title">Edit House</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <HouseForm
          form={form}
          setForm={setForm}
          photos={photos}
          setPhotos={setPhotos}
          onSubmit={submitHandler}
          submitText="Update House"
        />
      )}
    </div>
  );
}
