import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const GetRecommendations = () => {
  const [preferences, setPreferences] = useState({
    Genre: [],
    Actor: [],
    Director: [],
    Year: 0,
  });

  const navigate = useNavigate();

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => {
      if (key === "Year") {
        return { ...prev, [key]: value };
      }
      
      const currentValues = prev[key];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [key]: currentValues.filter((item) => item !== value)
        };
      } else {
        return {
          ...prev,
          [key]: [...currentValues, value]
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/user_preferences",
        preferences,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Preferences sent successfully!");
        navigate("/show_recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send preferences to the server.");
    }
  };

  const ButtonGrid = ({ title, items, category }) => (
    <div className="mb-6">
      <p className="mb-3 text-lg font-semibold">{title}</p>
      <div className="grid grid-cols-2 rounded-3xl sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => handlePreferenceChange(category, item)}
            className={`px-2 py-2 rounded-lg text-sm 
              ${preferences[category].includes(item)
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
              } hover:bg-blue-500 rounded-3xl hover:border-blue-300 transition-all duration-200`}
          >
            {item.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
    </div>
  );

  const genres = ["Drama", "Action", "Comedy", "Thriller", "Crime", "Horror", "Family", "Fantasy"];
  const cast = [
    "JackieChan", "JohnWayne", "SusanSarandon", "JamesFranco",
    "TomHanks", "JohnnyDepp", "AlPacino", "NicoleKidman", "RobertDeNiro",
    "NickNolte", "Madonna", "AntonioBanderas", "JonathanPryce"
  ];
  const crew = [
    "WoodyAllen", "AlfredHitchcock", "CharlieChaplin", "JohnHuston",
    "JohnFord", "RogerCorman", "IngmarBergman", "GeraldThomas"
  ];

  return (
    <div className="pl-[20%] flex h-screen">
      <Sidebar />
      <div className="flex-grow p-8 bg-black text-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-500 mb-8 text-center">
            Tell Us Your Preferences
          </h1>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <ButtonGrid title="Genre" items={genres} category="Genre" />
            <ButtonGrid title="Cast" items={cast} category="Actor" />
            <ButtonGrid title="Crew" items={crew} category="Director" />
            
            <div className="mb-6">
              <p className="mb-3 text-lg font-semibold">Year</p>
              <input
                type="text"
                placeholder="Enter Year"
                value={preferences.Year}
                onChange={(e) => handlePreferenceChange("Year", e.target.value)}
                className="px-4 py-2 rounded-3xl bg-gray-700 text-gray-300 w-full 
                  border border-white/20 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-3 rounded-lg 
                hover:bg-blue-600 transition-colors duration-200 
                border border-blue-400 hover:border-blue-300"
            >
              Get Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetRecommendations;