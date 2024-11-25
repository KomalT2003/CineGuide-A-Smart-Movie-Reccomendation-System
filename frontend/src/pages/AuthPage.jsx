import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


const AuthPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        region: '',
        likedMovies: '',
    });

    
    const navigate = useNavigate();

    // Access setUser from UserContext
    const { setUser } = useUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:5000/save_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                region: formData.region,
                likedMovies: [],
            }),
        });

        const result = await response.json();
        alert(result.message);

        // Redirect to the Homepage if successful
        if (response.ok) {
            // Update the user in context
            setUser({
                username: formData.username,
                region: formData.region,
                likedMovies: [],
            });
            navigate('/home');
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-cover bg-stone-900 bg-center text-white"
        >
            <img></img>
            <h1 className="text-4xl font-bold text-blue-600 my-8">
                CineGuide
            </h1>
            <form
                onSubmit={handleSubmit}
                className="bg-stone-800 p-6 rounded shadow-lg space-y-4 w-96"
            >
                <h1 className="text-2xl font-bold text-center">Let's Log You In</h1>

                <div>
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="w-full p-2 rounded bg-gray-700"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 rounded bg-gray-700"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Region</label>
                    <select
                        name="region"
                        className="w-full p-2 rounded bg-gray-700"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Region</option>
                        <option value="North America">North America</option>
                        <option value="Europe">Europe</option>
                        <option value="Asia">Asia</option>
                        <option value="Australia">Australia</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 rounded bg-blue-600 hover:bg-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AuthPage;
