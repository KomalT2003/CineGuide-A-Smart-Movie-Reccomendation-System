import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"
import LikedMovies from "../components/LikedMovies";
import TrendingMovies from "../components/TrendingMovies";
import Friends from "../components/Friends";
import Graph from "../components/Graph";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching Liked Movies
    fetch("/path-to-users.json")
      .then((res) => res.json())
      .then((data) => setLikedMovies(data.likedMovies));

    // Fetching Trending Movies
    fetch("/path-to-ratings.json")
      .then((res) => res.json())
      .then((data) => setTrendingMovies(data.trendingMovies));

    // Fetching Friends
    fetch("/path-to-users.json")
      .then((res) => res.json())
      .then((data) =>
        setFriends(
          data.friends.map((friend) => ({
            name: friend.name,
            lastLiked: friend.likedMovies[friend.likedMovies.length - 1],
          }))
        )
      );
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="bg-stone-900 text-white flex-1 p-8 space-y-8">
        <div className="bg-stone-800 p-6 rounded-lg flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Get Started Now!! Get Recommendations!</h1>
          </div>
          <button
            onClick={() => navigate("/get_recommendations")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Get Started
          </button>
        </div>
        {/* <div className="grid grid-cols-2 bg-stone-800 rounded-lg gap-8 p-6">
          <Friends friends={friends} /> 
          <Graph/>
        </div> */}
        <div className="grid bg-stone-800 rounded-lg gap-8 p-6">
          <LikedMovies movies={likedMovies} />
        </div>
        <TrendingMovies movies={trendingMovies} />
      </div>
    </div>
  );
};

export default HomePage;
