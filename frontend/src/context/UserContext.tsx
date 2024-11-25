import React, { createContext, useContext, useState, ReactNode } from 'react';


interface User {
    username: string;
    region: string;
    likedMovies: string[];
    friends: string[];
}

// Define the context value type
interface UserContextType {
    user: User | null; // Current user or null if not logged in
    setUser: (user: User | null) => void; // Function to update the user
}

// Create the context with a default value of null
const UserContext = createContext<UserContextType | null>(null);

// UserProvider component to wrap the app
interface UserProviderProps {
    children: ReactNode; // Accepts child components as props
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // Store user state here

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook for easier usage of UserContext
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
