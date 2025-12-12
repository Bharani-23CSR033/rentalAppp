import "./Signup.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Signup() {
  const { signup, loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...signupData } = form;
    signup(signupData);
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <form className="signup-card" onSubmit={submitHandler}>
          <div className="signup-header">
            <h1>🏡 Create Account</h1>
            <p>Join us as a home seeker or property owner</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="input-field"
              value={form.name}
              onChange={changeHandler}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input-field"
              value={form.email}
              onChange={changeHandler}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 6 characters"
              className="input-field"
              value={form.password}
              onChange={changeHandler}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              className="input-field"
              value={form.confirmPassword}
              onChange={changeHandler}
              required
              disabled={loading}
            />
            <div className="password-toggle">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="checkbox-label">
                Show password
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Your Role</label>
            <select
              id="role"
              name="role"
              className="input-field"
              value={form.role}
              onChange={changeHandler}
              disabled={loading}
            >
              <option value="user">👤 Home Seeker (Find & Book)</option>
              <option value="owner">🏠 Property Owner (List & Manage)</option>
            </select>
          </div>

          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="signup-footer">
            <p>
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Sign in
              </a>
            </p>
          </div>

          <div className="role-info">
            <p><strong>🏠 Owner:</strong> List properties, manage bookings, accept/reject requests</p>
            <p><strong>👤 Seeker:</strong> Browse homes, send requests, book your next home</p>
          </div>
        </form>
      </div>
    </div>
  );
}
