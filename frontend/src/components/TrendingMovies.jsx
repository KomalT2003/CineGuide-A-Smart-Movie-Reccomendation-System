import React from "react";

const TrendingMovies = ({ movies }) => {
  return (
    <div className="bg-stone-800 text-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Trending Movies</h2>
      <div className="flex space-x-4">
        {movies.map((movie, index) => (
          <div key={index} className="w-24 h-36 bg-gray-700 rounded-lg flex items-center justify-center">
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
