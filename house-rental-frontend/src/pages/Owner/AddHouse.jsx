import "./Owner.css";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function AddHouse() {
  const [form, setForm] = useState({
    title: "",
    cost: "",
    description: "",
    location: "",
    furnishing: "Furnished",
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // 🛑 Frontend validation
    if (!form.title || !form.cost || !form.location) {
      toast.error("Title, cost, and location are required");
      return;
    }

    if (photos.length === 0) {
      toast.error("Please upload at least 1 house photo");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    photos.forEach((file) => fd.append("photos", file));

    try {
      setLoading(true);
      const res = await axiosInstance.post("/owner/house", fd);

      toast.success("House added successfully!");

      // Clear form after success
      setForm({
        title: "",
        cost: "",
        description: "",
        location: "",
        furnishing: "Furnished",
      });
      setPhotos([]);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add house");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2 className="page-title">Add New House</h2>

      <form className="glass add-house-form" onSubmit={submitHandler}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={changeHandler}
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={changeHandler}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={changeHandler}
        ></textarea>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={changeHandler}
        />

        <select
          name="furnishing"
          value={form.furnishing}
          onChange={changeHandler}
        >
          <option>Furnished</option>
          <option>Semi-Furnished</option>
          <option>Unfurnished</option>
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setPhotos([...e.target.files])}
        />

        <button className="add-btn" disabled={loading}>
          {loading ? "Adding..." : "Add House"}
        </button>
      </form>
    </div>
  );
}
