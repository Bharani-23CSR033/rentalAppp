import "./Navbar.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏠 HouseRental
        </Link>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          <span className="hamburger"></span>
        </div>

        {user && (
          <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
            {user.role === "owner" && (
              <>
                <Link
                  to="/owner/dashboard"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/owner/houses"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  📋 My Properties
                </Link>
                <Link
                  to="/owner/add"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  ➕ Add Property
                </Link>
                <Link
                  to="/owner/requests"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  📬 Requests
                </Link>
              </>
            )}

            {user.role === "user" && (
              <>
                <Link
                  to="/user/dashboard"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  🏠 Browse
                </Link>
                <Link
                  to="/user/myhouse"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  🏡 My Booking
                </Link>
                <Link
                  to="/user/rejected"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  🚫 Rejected
                </Link>
              </>
            )}

            <div className="nav-user-info">
              <span className="nav-user-name">{user.name}</span>
              <span className={`nav-user-role ${user.role}`}>
                {user.role === "owner" ? "🏠 Owner" : "👤 Seeker"}
              </span>
            </div>

            <button className="logout-btn" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
