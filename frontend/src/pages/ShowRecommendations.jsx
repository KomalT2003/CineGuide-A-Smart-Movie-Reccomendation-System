import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OMDB_API_KEY = '6144ca19';

// Custom hook for fetching movie poster
const useMoviePoster = (movieTitle) => {
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const params = {
          apikey: OMDB_API_KEY,
          t: movieTitle,
          plot: 'short'
        };
        
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(
          `https://www.omdbapi.com/?${queryString}`
        );

        if (response.data.Poster && response.data.Poster !== 'N/A') {
          setPoster(response.data.Poster);
        }
      } catch (error) {
        console.error(`Error fetching poster for ${movieTitle}:`, error);
      }
    };

    if (movieTitle) {
      fetchPoster();
    }
  }, [movieTitle]);

  return poster;
};

const MovieCard = React.memo(({ movie, onClick }) => {
  const poster = useMoviePoster(movie.title);

  const renderRatingStars = (rating) => {
    let numStars;
    if (rating === 'N/A') {
      numStars = 3;
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

  return (
    <div 
      onClick={onClick}
      className="group bg-stone-800 px-4 py-4 rounded-lg shadow-lg overflow-hidden w-64 flex-shrink-0 
        transition-all duration-300 ease-in-out 
        hover:scale-105 
        hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]
        cursor-pointer"
    >
      <div className="w-full h-64 relative bg-stone-700 rounded-lg">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="absolute inset-0 w-full h-full rounded-lg object-cover 
              transition-transform duration-300 ease-in-out 
              group-hover:brightness-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/api/placeholder/256/384";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-500 p-4">
            <span className="text-sm text-center">{movie.title}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h2 className="text-lg font-bold truncate 
          transition-colors duration-300 
          group-hover:text-blue-500">{movie.title}</h2>
        <p className="text-stone-400">{movie.year}</p>
        {renderRatingStars(movie.rating)}
      </div>
    </div>
  );
});

const ShowRecommendations = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState({}); 
  const [filterType, setFilterType] = useState("genre"); 
  const [filteredMovies, setFilteredMovies] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://127.0.0.1:5000/reccomended_movies");
        console.log(response.data);
        setMovies(response.data);
        setFilteredMovies(response.data["genre"] || []); 
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to fetch movies. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    setFilteredMovies(movies[filterType] || []); 
    setCurrentIndex(0);
  }, [filterType, movies]);

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleMovieClick = (movie) => {
    console.log("Movie Object being sent: ",movie);
    navigate(`/movie/${movie.title}`, { 
      state: { movie } 
    });
  };

  const nextSlide = () => {
    setCurrentIndex((current) => 
      current + 4 >= filteredMovies.length ? 0 : current + 4
    );
  };

  const prevSlide = () => {
    setCurrentIndex((current) => 
      current - 4 < 0 ? Math.max(filteredMovies.length - 4, 0) : current - 4
    );
  };

  const visibleMovies = filteredMovies.slice(currentIndex, currentIndex + 4);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-black text-white items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-black text-white items-center justify-center">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-black text-white p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Here are our Top Picks for you!!</h1>

        <div className="mb-6">
          <select
            name="filterType"
            className="bg-gray-700 text-white p-2 rounded"
            value={filterType}
            onChange={handleFilterTypeChange}
          >
            <option value="genre">Genre</option>
            <option value="actor">Actor</option>
            <option value="director">Director</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="relative bg-stone-900 p-4 rounded-lg">
          {filteredMovies.length > 0 ? (
            filteredMovies.length > 4 ? (
              <div className="flex items-center relative">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Previous slides"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                <div className="flex gap-4 overflow-hidden w-full px-8">
                  {visibleMovies.map((movie, index) => (
                    <MovieCard 
                      key={movie.id || index}
                      movie={movie}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Next slides"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie, index) => (
                  <MovieCard 
                    key={movie.id || index}
                    movie={movie}
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No movies found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowRecommendations;