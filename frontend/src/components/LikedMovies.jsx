import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "../context/UserContext";

const LikedMovies = () => {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      try {
        setIsLoading(true);
        const username = user.username;
        const response = await axios.post("http://127.0.0.1:5000/get_liked_movies", { username });
        setMovies(response.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching liked movies:", error);
        setError("Failed to fetch liked movies. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchLikedMovies();
  }, [user.username]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 4 >= movies.length ? 0 : prev + 4));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 4 < 0 ? Math.max(movies.length - 4, 0) : prev - 4));
  };

  // Updated renderRatingStars function to handle 'N/A' ratings
  const renderRatingStars = (rating) => {
    let numStars;
    if (rating === 'N/A') {
      numStars = 3; // Default to 3 stars for N/A ratings
    } else {
      numStars = Math.min(Math.max(Math.round(Number(rating) / 10 * 5), 0), 5);
    }
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < numStars ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  const renderMovieCard = (movie, index) => (
    <div
      key={movie.id || index}
      className="group bg-stone-900 px-4 py-4 rounded-lg shadow-lg overflow-hidden w-64 flex-shrink-0 
        transition-all duration-300 ease-in-out 
        hover:scale-105 
        hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]
        cursor-pointer"
    >
      <img
        src={movie.image || "https://via.placeholder.com/150"}
        alt={movie.title || movie.name}
        className="w-full h-64 rounded-lg object-cover 
          transition-transform duration-300 ease-in-out 
          group-hover:brightness-110"
      />
      <div className="mt-2">
        <h2 className="text-lg text-white font-bold 
          transition-colors duration-300 
          group-hover:text-blue-500">
          {movie.title || movie.name}
        </h2>
        <p className="text-stone-400">{movie.year}</p>
        {renderRatingStars(movie.rating)}
      </div>
    </div>
  );

  const visibleMovies = movies.slice(currentIndex, currentIndex + 4);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white h-1/2">
      <h1 className="text-3xl text-blue-500 font-bold mb-6">Your Liked Movies</h1>
      <div className="relative bg-stone-800 rounded-lg">
        {movies.length > 0 ? (
          movies.length > 4 ? (
            <div className="flex items-center relative">
              <button
                onClick={prevSlide}
                className="absolute left-0 z-10 bg-black/50 rounded-full 
                  hover:bg-black/70 transition-colors"
                aria-label="Previous slides"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <div className="flex gap-4 overflow-hidden w-full">
                {visibleMovies.map(renderMovieCard)}
              </div>

              <button
                onClick={nextSlide}
                className="absolute right-0 z-10 bg-black/50 rounded-full 
                  hover:bg-black/70 transition-colors"
                aria-label="Next slides"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movies.map(renderMovieCard)}
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>You haven't liked any movies yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedMovies;