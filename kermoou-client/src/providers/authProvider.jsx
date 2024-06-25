import axios from 'axios';
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	let parsedUser;
	if (localStorage.getItem('user')) {
		try {
			parsedUser = JSON.parse(localStorage.getItem('user'));
		} catch (error) {
			localStorage.removeItem('user');
		}
	}
	// State to hold the authentication token
	const [token, setToken_] = useState(localStorage.getItem('token'));
	let [user, setUser_] = useState(parsedUser);

	// Function to set the authentication token
	const setToken = (newToken) => {
		setToken_(newToken);
	};

	// Function to set the user
	const setUser = (newUser) => {
		setUser_(newUser);
	};

	const logout = () => {
		setToken_(null);
		setUser_(null);
	};

	if (token) {
		// console.log('setting token');
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
		localStorage.setItem('token', token);

		localStorage.setItem('user', JSON.stringify(parsedUser));
		if (!user) {
			axios.get('/api/user/me').then((response) => {
				// setUser_(response.data);
				const user = response.data;
				setUser_(user);
				localStorage.setItem('user', JSON.stringify(user));
			});
		}
	} else {
		// console.log('deleting token');
		delete axios.defaults.headers.common['Authorization'];
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}

	// Memoized value of the authentication context
	const contextValue = useMemo(
		() => ({
			token,
			setToken,
			user,
			setUser,
			logout,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[token, user],
	);

	// Provide the authentication context to the children components
	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export default AuthProvider;
