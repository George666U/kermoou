import '../styles/Auth.css';

import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../providers/authProvider';
import { toast } from 'react-toastify';

const Register = () => {
	const { token, setToken, setUser } = useAuth();
	const [error, setError] = useState();

	const handleRegister = async ({ email, username, password }) => {
		try {
			const response = await axios.post('/api/auth/register', {
				email,
				username,
				password,
			});
			return response.data;
		} catch (error) {
			console.error(error);
			setError(error.response.data?.message ?? 'Хибний формат даних');
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
			handleRegister({
				email: data.email,
				username: data.username,
				password: data.password,
			}),
			{
				pending: 'Реєстрація...',
				error: 'Помилка реєстрації',
				success: 'Ви успішно зареєструвались',
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
				<h3>Реєстрація</h3>
				<div>
					{error && <div className="auth__form-error">{error}</div>}
					<div className="auth__form__item">
						<label htmlFor="email">Електронна адреса</label>
						<input id="email" name="email" type="email" placeholder="example@email.com" />
					</div>
					<div className="auth__form__item">
						<label htmlFor="username">Псевдонім</label>
						<input id="username" name="username" type="text" placeholder="username" />
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
					<button className="auth__form-button">Зареєструватись</button>
				</div>
			</form>
		</div>
	);
};

export default Register;
