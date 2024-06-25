import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';
import axios from 'axios';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
	const { token, setUser, setToken } = useAuth();

	// Perform a request to the server to check if the token is valid and get the user data
	const fetchUserData = async () => {
		try {
			const response = await axios('/api/user/me');

			{
				// If the token is valid, get the user data from the response
				const user = response.data;
				// Store the user data in the context
				setUser(user);
			}
		} catch (error) {
			console.log(error);
			if (error.response.status === 401) {
				// If the token is invalid, remove the user data from the context
				setUser(null);
				setToken(null);
			}
			console.error(error);
		}
	};

	// Fetch the user data when the component is mounted
	useEffect(() => {
		if (token) fetchUserData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	// Check if the user is authenticated
	if (!token) {
		// If not authenticated, redirect to the login page
		return <Navigate to="/signin" />;
	}

	// If authenticated, render the child routes
	return <Outlet />;
};
