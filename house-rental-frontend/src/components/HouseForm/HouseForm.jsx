import "./HouseForm.css";

export default function HouseForm({
  form,
  setForm,
  photos,
  setPhotos,
  onSubmit,
  submitText = "Submit"
}) {
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form className="glass house-form fade-in" onSubmit={onSubmit}>
      <input
        type="text"
        name="title"
        placeholder="House Title"
        value={form.title}
        onChange={changeHandler}
      />

      <input
        type="number"
        name="cost"
        placeholder="Cost (₹)"
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

      <select name="furnishing" value={form.furnishing} onChange={changeHandler}>
        <option value="Furnished">Furnished</option>
        <option value="Semi-Furnished">Semi-Furnished</option>
        <option value="Unfurnished">Unfurnished</option>
      </select>

      <label className="photo-label">Upload Photos</label>
      <input
        type="file"
        multiple
        onChange={(e) => setPhotos([...e.target.files])}
      />

      <button className="submit-btn">{submitText}</button>
    </form>
  );
}
