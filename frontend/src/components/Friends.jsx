import React from "react";

const Friends = ({ friends }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Friends</h2>
      {friends.map((friend, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 rounded-full w-8 h-8"></div>
            <p>Vanshika</p>
            <p>Samarth</p>
          </div>
          <p className="text-sm text-blue-400">Recently Liked the Movie {friend.lastLiked}</p>
        </div>
      ))}
    </div>
  );
};

export default Friends;
