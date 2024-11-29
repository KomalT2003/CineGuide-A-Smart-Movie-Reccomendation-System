import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const MovieCard = memo(({ movie, id }) => {
  const poster = useMoviePoster(movie.title);
  
  const renderRatingStars = (rating) => {
    let numStars;
    if (rating === 'N/A') {
      numStars = 3;
    } else {
      numStars = Math.min(Math.max(Math.round(Number(rating) / 10 * 5), 0), 5);
    }
    
    return [...Array(5)].map((_, index) => (
      <span key={index} className="text-yellow-400">
        {index < numStars ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className=" group bg-stone-800 px-4 py-4 rounded-lg shadow-lg overflow-hidden w-64 flex-shrink-0 
      transition-all duration-300 ease-in-out 
      hover:scale-105 
      hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]
      cursor-pointer">
      <div className="w-full h-64 relative bg-stone-700 rounded-lg">
        {poster && poster !== 'Poster not available' ? (
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
          group-hover:text-blue-500">
          {movie.title}
        </h2>
        <p className="text-stone-400">{movie.year}</p>
        <div className="flex items-center">
          {renderRatingStars(movie.rating)}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.movie.title === nextProps.movie.title;
});

const MoreLikeThisPage = () => {
  const { movieName } = useParams();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post("http://127.0.0.1:5000/get_more_recommendations", {
          movieName,
        });
        const moviesWithIds = (response.data || []).map((movie, index) => ({
          ...movie,
          stableId: `${movie.title}-${index}`,
        }));
        setMovies(moviesWithIds);
      } catch (error) {
        setError("Failed to fetch similar movies. Please try again later.");
        console.error("Error fetching similar movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSimilarMovies();
  }, [movieName]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 4 >= movies.length ? 0 : prev + 4));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 4 < 0 ? Math.max(movies.length - 4, 0) : prev - 4));
  };

  const visibleMovies = movies.slice(currentIndex, currentIndex + 4);

  return (
    <div className="pl-[20%] flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">
          More Movies Like "{decodeURIComponent(movieName)}"
        </h1>
        <div className="relative bg-stone-900 p-4 rounded-lg">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4">Loading similar movies...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
            </div>
          ) : movies.length > 0 ? (
            <div className="relative">
              {movies.length > 4 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full
                    hover:bg-black/70 transition-colors duration-200"
                  aria-label="Previous slides"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
              )}

              <div className="flex gap-4 overflow-hidden">
                {visibleMovies.map((movie) => (
                  <MovieCard 
                    key={movie.stableId}
                    id={movie.stableId}
                    movie={movie}
                  />
                ))}
              </div>

              {movies.length > 4 && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full
                    hover:bg-black/70 transition-colors duration-200"
                  aria-label="Next slides"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No similar movies found for "{decodeURIComponent(movieName)}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreLikeThisPage;