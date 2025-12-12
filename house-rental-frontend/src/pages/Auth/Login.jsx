import "./Login.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <form className="login-card" onSubmit={submitHandler}>
          <div className="login-header">
            <h1>🏠 Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="signup-link">
                Create one
              </a>
            </p>
          </div>

          <div className="demo-credentials">
            <p><strong>Demo Owner:</strong> owner@demo.com / password123</p>
            <p><strong>Demo User:</strong> user@demo.com / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
