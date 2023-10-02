import React, { useState } from 'react'
import { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from 'react-router-dom';


export default function Home() {
    const { user, loginWithRedirect, isAuthenticated } = useAuth0();
    const [ isComplete, setIsComplete ] = useState(false);

    useEffect(() => {
        
        const handleBackendAuth = async () => {
          if (isAuthenticated && user) {
            // Store the user data obtained from the OAuth hook in localStorage
            localStorage.setItem('userData', JSON.stringify(user));
    
            // Send user data to the backend
            const response = await fetch('http://localhost:3001/authenticate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user }), // Send the user data to the backend
            });
    
            if (response.ok) {
              setIsComplete(true)
            }
          }
        };
    
        handleBackendAuth();
      }, [isAuthenticated, user]);

    if(isComplete){
        return <Navigate replace to="/documents" />;
    }

    return <button onClick={() => loginWithRedirect()}>Log In</button>;
    
}
