import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import { Users, TrendingUp, Heart, Star } from 'lucide-react';

const FriendsPage = () => {
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user || !user.username) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`http://127.0.0.1:5000/get_friends/${user.username}`);
        setFriends(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to fetch friends. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  // Helper function to render similarity score as color-coded progress bar
  const renderSimilarityScore = (score) => {
    const getColorClass = (score) => {
      if (score >= 75) return 'bg-green-500';
      if (score >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div 
          className={`h-2.5 rounded-full ${getColorClass(score)}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-red-500 text-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center mb-8">
          <Users className="mr-4 text-blue-500" size={40} />
          <h1 className="text-4xl font-bold text-blue-500">My Friends</h1>
        </div>

        {friends.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>You haven't added any friends yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend, index) => (
              <div 
                key={index} 
                className="bg-stone-900 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={friend.profile_pic || "https://via.placeholder.com/150"} 
                    alt={friend.username}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">{friend.username}</h2>
                    <p className="text-stone-400">{friend.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 text-green-500" size={20} />
                    <span>Similarity Score</span>
                    {renderSimilarityScore(friend.similarity_score)}
                    <span className="ml-2 text-sm text-gray-400">
                      {friend.similarity_score.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Heart className="mr-2 text-red-500" size={20} />
                    <span>Shared Likes</span>
                    <span className="ml-2 font-bold text-white">
                      {friend.shared_likes || 0}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Star className="mr-2 text-yellow-500" size={20} />
                    <span>Common Ratings</span>
                    <span className="ml-2 font-bold text-white">
                      {friend.common_ratings || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;