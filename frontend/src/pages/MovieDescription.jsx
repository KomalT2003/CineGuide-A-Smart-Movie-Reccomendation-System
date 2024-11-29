import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useUser } from '../context/UserContext';


const MovieDescriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const { movie } = location.state || {};

  if (!movie) {
    return (
      <div className="flex h-screen bg-black text-white items-center justify-center">
        <p>No movie details available</p>
      </div>
    );
  }
  else {
    console.log(movie);
  }

  const handleLike = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/like_movie", {
        username: user.username, 
        title: movie.title,
        rating: movie.rating,
        cast: movie.cast,
        crew: movie.crew,
        year: movie.year,
        description: movie.description,
        image: movie.image

      });
      if (response.status === 200) {
        alert(`Liked "${movie.title}" successfully!`);
      }
    } catch (error) {
      console.error("Error liking movie:", error);
      alert("Failed to like the movie.");
    }
  };

  const handleMoreLikeThis = () => {
    navigate(`/more_like_this/${encodeURIComponent(movie.title)}`, {
      state: { movie },
    });
  };

  return (
    <div className="pl-[20%] flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 text-2xl font-bold hover:text-gray-300 transition-colors"
        >
          ←
        </button>

        <div className="grid p-8 grid-cols-1 md:grid-cols-2 gap-8 bg-stone-900 rounded-lg overflow-hidden">
          <div className="w-full h-[600px]">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl text-blue-500 font-bold mb-6">{movie.title}</h1>
              <div className="space-y-4">
                <p className="text-lg text-stone-500">
                  <span className="font-semibold text-stone-300">Rating:</span> {movie.rating}
                </p>
                <p className="text-lg text-stone-500">
                  <span className="font-semibold text-stone-300">Cast:</span> {movie.cast}
                </p>
                <p className="text-lg text-stone-500">
                  <span className="font-semibold text-stone-300">Director:</span> {movie.crew}
                </p>
                <p className="text-lg text-stone-500">
                  <span className="font-semibold text-stone-300">Year:</span> {movie.year}
                </p>
                <p className="mt-4 text-stone-500 whitespace-pre-wrap">
                <span className="font-semibold text-stone-200">Description</span><br />
                  {movie.description}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 mt-8">
              <button 
                onClick={handleLike}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition"
              >
                Like Now
              </button>
              <button 
                onClick={handleMoreLikeThis}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition"
              >
                More Like This
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDescriptionPage;
