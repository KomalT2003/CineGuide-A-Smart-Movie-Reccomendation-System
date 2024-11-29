import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // Access user from context
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    alert("Logged out successfully!");
    setUser(null); // Clear the user from context
    navigate("/"); // Redirect to the authentication/login page
  };

  // Helper function to determine if a route is active
  const isActive = (path) => location.pathname === path;

  // Helper function for grouped routes
  const isRecommendedActive = () =>
    ["/get_recommendations", "/show_recommendations", "/movie/:id", "/more_like_this/:movie_name"].some(
      (route) => location.pathname.startsWith(route.split(":")[0]) // Match dynamic routes
    );

  return (
    <div className="fixed top-0 left-0 bg-stone-800 text-white w-1/5 h-screen flex flex-col justify-between overflow-y-auto z-50">
      <div className="flex">
      <img src={logo} className="w-12 h-12 mt-8 ml-6 mr-2 "></img>
      <h1 className="text-3xl mt-8 text-center font-bold text-blue-500">CineGuide</h1>
      </div>
      <div className="flex flex-col justify-center flex-grow space-y-6">
        
        <nav className="flex flex-col space-y-4">
          {/* Home */}
          <Link
            to="/home"
            className={`px-4 py-4 rounded-lg font-semibold transition duration-300 ${
              isActive("/home") ? "bg-blue-800" : "hover:bg-blue-500"
            }`}
          >
            <p className="ml-12">Home</p>
          </Link>

          {/* Friends */}
          <Link
            to="/friends"
            className={`px-4 py-4 rounded-lg font-semibold transition duration-300 ${
              isActive("/friends") ? "bg-blue-300" : "hover:bg-blue-500"
            }`}
          >
            <p className="ml-12">Friends</p>
          </Link>

          {/* Recommended Movies */}
          <Link
            to="/get_recommendations"
            className={`px-4 py-4 rounded-lg font-semibold transition duration-300 ${
              isRecommendedActive() ? "bg-blue-300" : "hover:bg-blue-500"
            }`}
          >
            <p className="ml-12">Recommended Movies</p>
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className={`px-4 py-4 rounded-lg font-semibold transition duration-300 ${
              isActive("/profile") ? "bg-blue-300" : "hover:bg-blue-500"
            }`}
          >
            <p className="ml-12">Profile</p>
          </Link>
        </nav>
      </div>
      <div className="p-2 bg-blue-900 rounded-lg">
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-full w-10 h-10"
          />
          <div>
            <p>{user ? user.username : "Guest"}</p>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-100 rounded-lg hover:underline"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
