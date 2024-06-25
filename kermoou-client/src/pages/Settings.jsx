import { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/Settings.css';
import { useAuth } from '../providers/authProvider';
import axios from 'axios';
import { filetobase64 } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
	const { user, setUser } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState();
	const [uploadedImage, setUploadedImage] = useState(null);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		const base64 = await filetobase64(file);
		setUploadedImage(base64);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('submit');

		const formData = new FormData(e.target);
		const data = {};

		for (let [key, value] of formData.entries()) {
			if (value !== '') data[key] = value;
		}

		const updatePromise = async () => {
			try {
				if (data.avatar?.size > 0) {
					const staticUrl = '/api/file/uploads';
					const formDataAvatar = new FormData();
					formDataAvatar.append('file', data.avatar);
					const response = await axios.post(staticUrl, formDataAvatar);
					const filename = response.data.filename;
					data.profile_picture = staticUrl + '/' + filename;
				}

				const response = await axios.put('/api/user/me', data);
				setUser(response.data);
				navigate(`/users/${user.user_id}`);
			} catch (error) {
				console.error(error);
				setError(error.response.data?.message ?? 'Помилка оновлення профілю');
				throw error;
			}
		};

		await toast.promise(updatePromise, {
			pending: 'Оновлення...',
			success: 'Профіль успішно оновлено!',
			error: 'Помилка оновлення профілю',
		});
	};

	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit} className="settings">
				<h3>Редагування профілю</h3>
				<div className="settings__item">
					<label>Аватар</label>
					<div className="">
						<img
							src={uploadedImage ?? user.profile_picture ?? 'https://via.placeholder.com/150'}
							alt="avatar"
							className="settings__item-avatar"
						/>
					</div>
					<input
						onChange={handleImageUpload}
						type="file"
						accept="image/*"
						name="avatar"
						id="avatar"
					/>
					{/* <button className="settings__item-button">Завантажити фото</button> */}
				</div>
				<div className="settings__item">
					<label htmlFor="username">Псевдонім</label>
					<input id="username" name="username" type="text" defaultValue={user.username} />
				</div>
				<div className="settings__item">
					<label htmlFor="">Email</label>
					<input id="email" name="email" type="email" disabled defaultValue={user.email} />
				</div>
				<div className="settings__item settings__item-full">
					<label htmlFor="about">Про мене</label>
					<textarea id="about" name="about" defaultValue={user.about} />
				</div>
				{error && <div className="auth__form-error">{error}</div>}
				<div className="settings__item settings__item-full">
					<button className="settings__item-save-button">Зберегти</button>
				</div>
			</form>
		</div>
	);
};

export default Settings;
