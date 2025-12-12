import { Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Owner Pages
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import MyHouses from "./pages/Owner/MyHouses";
import AddHouse from "./pages/Owner/AddHouse";
import EditHouse from "./pages/Owner/EditHouse";
import OwnerRequests from "./pages/Owner/OwnerRequests";

// User Pages
import UserDashboard from "./pages/User/UserDashboard";
import MyHouse from "./pages/User/MyHouse";
import Rejected from "./pages/User/Rejected";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { HouseProvider } from "./context/HouseContext";

// Route Protection
import ProtectedRoute from "./utils/ProtectedRoute";

function AppContent() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && user && <Navbar />}
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* OWNER ROUTES */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/houses"
          element={
            <ProtectedRoute role="owner">
              <MyHouses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/add"
          element={
            <ProtectedRoute role="owner">
              <AddHouse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/edit/:id"
          element={
            <ProtectedRoute role="owner">
              <EditHouse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/requests"
          element={
            <ProtectedRoute role="owner">
              <OwnerRequests />
            </ProtectedRoute>
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/myhouse"
          element={
            <ProtectedRoute role="user">
              <MyHouse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/rejected"
          element={
            <ProtectedRoute role="user">
              <Rejected />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <HouseProvider>
        <AppContent />
      </HouseProvider>
    </AuthProvider>
  );
}

export default App;