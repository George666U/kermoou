import '../styles/Auth.css';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../providers/authProvider';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignIn = () => {
	const { token, setToken, setUser } = useAuth();
	const [error, setError] = useState();

	const handleSignIn = async (email, password) => {
		try {
			const response = await axios.post('/api/auth/login', {
				email,
				password,
			});
			return response.data;
		} catch (error) {
			console.error(error);
			setError(error.response.data?.message ?? 'Неправильний логін або пароль');
			throw error;
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const data = {};

		for (let [key, value] of formData.entries()) {
			data[key] = value;
		}

		const { access_token: token, user } = await toast.promise(
			handleSignIn(data.email, data.password),
			{
				pending: 'Авторизація...',
				error: 'Помилка авторизації',
				success: 'Успішний вхід!',
			},
		);
		if (token) {
			setError(null);
			setToken(token);
			setUser(user);
		}
	};

	if (token !== null) {
		return <Navigate to="/" />;
	}

	return (
		<div className="auth-wrapper">
			<form onSubmit={handleSubmit} className="auth__form">
				<h3>Авторизація</h3>
				<div>
					{error && <div className="auth__form-error">{error}</div>}
					<div className="auth__form__item">
						<label htmlFor="email">Електронна адреса</label>
						<input id="email" name="email" type="text" required placeholder="example@email.com" />
					</div>
					<div className="auth__form__item">
						<label htmlFor="password">Пароль</label>
						<input
							id="password"
							name="password"
							type="password"
							minLength={8}
							required
							placeholder="********"
						/>
					</div>
				</div>
				<div>
					<button className="auth__form-button">Увійти</button>
				</div>
			</form>
		</div>
	);
};

export default SignIn;
