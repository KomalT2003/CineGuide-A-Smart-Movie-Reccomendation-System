from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pandas as pd
import requests

app = Flask(__name__)
CORS(app)

user_pref={}

api_endpoint_birch = "https://0bf6-152-58-4-230.ngrok-free.app//get_recommendations"
api_endpoint_content = "https://0bf6-152-58-4-230.ngrok-free.app//get_more_recommendations"
api_endpoint_trending = "https://0bf6-152-58-4-230.ngrok-free.app//get_trending_movies"
api_endpoint_friends = "https://0bf6-152-58-4-230.ngrok-free.app//match_friends"

USERS_FILE = "users.json" # File where users are stored - username, password, region, liked movies
RATINGS_FILE = "ratings.json" # File where ratings of movies are stored - movie name, rating
MOVIES_FILE = "movies_all.csv" # File where movies are stored - movie name, year, genre, director, cast


def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r') as file:
        return json.load(file)


def save_users(users):
    with open(USERS_FILE, 'w') as file:
        json.dump(users, file, indent=4)

# Auth page -1 
# HANDLING THE USER PART PEHLE - Login Name, password, region, liked movies
@app.route('/save_user', methods=['POST'])
def save_user():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"message": "No data received"}), 400

    username = data.get('username')
    password = data.get('password')
    region = data.get('region')
    liked_movies = data.get('likedMovies', [])
    friends = data.get('friends', [])
    
    print(username, password, region, liked_movies)

    if not username or not password or not region:
        return jsonify({"message": "Missing required fields"}), 400

    users = load_users()

    for user in users:
        if user['username'] == username:
            # If the user exists, return their data
            print("user exists")
            return jsonify({"message": "User exists", "data": user})

    new_user = {
        "username": username,
        "password": password,
        "region": region,
        "liked_movies": liked_movies,
        "friends": friends
    }
    users.append(new_user)
    save_users(users)

    return jsonify({"message": "User added successfully", "data": new_user}), 201


# Homepage - 2
# section 1 - get user preference data for reccomendation
@app.route('/user_preferences', methods=['POST'])
def recommend():
    user_preferences = request.json  
    #recommendations = recommend_movies(user_preferences) 
    global user_pref
    user_pref = user_preferences 
    return "recommendations", 200

@app.route('/reccomended_movies', methods=['GET'])
def get_recommended_movies():
    global user_pref
    print("USER PREF:",user_pref)
    user_preferences = {"user_preferences": user_pref}
    # Convert the user preferences to JSON format
    payload = json.dumps(user_preferences)

    # Set the headers to indicate the content type is JSON
    headers = {'Content-Type': 'application/json'}

    response = requests.post(api_endpoint_birch, data=payload, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the response JSON
        recommendations = response.json()
        print("Recommendations received:")
        print(recommendations)
        return recommendations, 200
    else:
        print(f"Failed to get recommendations. Status code: {response.status_code}")
        return None, 500


# like a movie
@app.route('/like_movie', methods=['POST'])
def like_movie():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"message": "No data received"}), 400
    
    # after liking a movie, add it to the user's liked movies
    users = load_users()
    print("Looking for user: ",data['username'])
    movie = {}
    movie['title'] = data['title']
    movie['year'] = data['year']
    movie['rating'] = data['rating']
    movie['image'] = data['image']
    movie['cast'] = data['cast']
    movie['crew'] = data['crew']
    movie['description'] = data['description']

    for user in users:
        if user['username'] == data['username']:
            user['liked_movies'].append(movie)
            print("User found")
            break
    save_users(users)
    return jsonify({"message": "Movie liked successfully"}), 200

# get liked movies
@app.route('/get_liked_movies', methods=['POST'])
def get_liked_movies():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"message": "No data received"}), 400
    users = load_users()
    for user in users:
        if user['username'] == data['username']:
            liked_movies = user['liked_movies']
            break
    
    return liked_movies, 200

# more_like_this get endpoint
@app.route('/get_more_recommendations', methods=['POST'])
def reccomend_more():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data received"}), 400

    payload = json.dumps(data)

    # Set the headers to indicate the content type is JSON
    headers = {'Content-Type': 'application/json'}

    new_reccomendations = requests.post(api_endpoint_content, data=payload, headers=headers)
    
    print(new_reccomendations)
    print(type(new_reccomendations))

    # Check if the response is successful
    if new_reccomendations.status_code == 200:
        # Return the JSON content from the external API response
        return jsonify(new_reccomendations.json()), 200
    else:
        # Handle errors gracefully
        return jsonify({"message": "Failed to fetch recommendations", "status": new_reccomendations.status_code}), new_reccomendations.status_code


@app.route('/get_trending_movies', methods=['GET'])
def get_trending_movies():
    response = requests.get(api_endpoint_trending)
    print(response)
    if response.status_code == 200:
        trending_movies = response.json()
        return trending_movies, 200
    else:
        return jsonify({"message": "Failed to fetch trending movies"}), 500
    
@app.route('/get_friends', methods=['POST'])
def get_friends():
    data = request.get_json()
    # extract username from the request
    username1 = data['username']
    users = load_users()
    friends = []
    friends_user = []
    # get liked movies of username1
    for user in users:
        if user['username'] == username1:
            liked_movies_objects = user['liked_movies']
            break
    liked_movies = [movie['title'] for movie in liked_movies_objects]
    
    for user in users:
        print(user['username'])
    
    friends_data = []
    # get all other users
    for user in users:
        if user['username'] != username1:
            liked_movies2 = user['liked_movies']
            print("calculating similarity between ", username1, " and ", user['username'])
            liked_movies2 = [movie['title'] for movie in liked_movies2]
            payload = {"liked_movies_user1": liked_movies, "liked_movies_user2": liked_movies2}
            headers = {'Content-Type': 'application/json'}
            response = requests.post(api_endpoint_friends, data=json.dumps(payload), headers=headers)
            if response.status_code == 200:
                sim_data = response.json()
                friends_user.append({"username": user['username'], "score": sim_data['similarity'],
                                     "liked_movies": sim_data['liked_movies'], "common_movies": sim_data['common_movies'],
                                     "common_ratings": sim_data['common_ratings']})
                print(friends_user)
                for friend in friends_user:
                    print(friend)
                    if friend['score'] > 50:
                        if friend['username'] not in friends:
                            friends.append(friend['username'])
                            friends_data.append(friend)
                            
    friends = list(set(friends))
    for user in users:
        if user['username'] == username1:
            for friend in friends:
                if friend not in user['friends']:
                    user['friends'].append(friend)
            break
    save_users(users)
    if friends:
        return jsonify({"message": "Friends fetched successfully", "friends": friends_data}), 200
    else:
        return jsonify({"message": "Failed to fetch friends"}), 500


@app.route('/fetch_friends', methods=['POST'])
def fetch_friends():
    data = request.get_json()
    username = data['username']
    users = load_users()
    friends = []
    for user in users:
        if user['username'] == username:
            friends = user['friends']
            break
    return jsonify(friends), 200

@app.route('/', methods=['GET'])
def home():
    return "Hello World!"


if __name__ == '__main__':
    app.run(debug=True)