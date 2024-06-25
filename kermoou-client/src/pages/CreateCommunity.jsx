import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';
import '../styles/CreateCommunity.css';
import { useState } from 'react';
import { filetobase64 } from '../utils/utils';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateCommunity = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [uploadedImage, setUploadedImage] = useState(null);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		const base64 = await filetobase64(file);
		setUploadedImage(base64);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = {};

		for (let [key, value] of formData.entries()) {
			if (value !== '') data[key] = value;
		}

		const createPromise = async () => {
			if (data.avatar?.size > 0) {
				const staticUrl = '/api/file/uploads';
				const formDataAvatar = new FormData();
				formDataAvatar.append('file', data.avatar);

				const response = await axios.post(staticUrl, formDataAvatar);
				const filename = response.data.filename;
				data.profile_picture = staticUrl + '/' + filename;
			}

			const response = await axios.post('/api/community/', data);
			navigate(`/communities/${response.data.community_id}`);
		};

		await toast.promise(createPromise(), {
			pending: 'Створення...',
			success: 'Спільноту успішно створено!',
			error: 'Помилка при створенні спільноти',
		});
	};
	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit} className="create-community">
				<h3>Створення спільноти</h3>
				<div className="create-community__item">
					<label htmlFor="title">Назва</label>
					<input id="title" name="title" type="text" defaultValue={''} />
				</div>
				<div className="create-community__item">
					<label>Фото</label>
					<div className="">
						<img
							src={uploadedImage ?? 'https://via.placeholder.com/150'}
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
					{/* <button className="create-community__item-button">Завантажити фото</button> */}
				</div>
				<div className="create-community__item create-community__item-full">
					<label htmlFor="about">Опис спільноти</label>
					<textarea id="about" name="about" />
				</div>
				<div className="create-community__item create-community__item-full">
					<button className="create-community__item-save-button">Створити</button>
				</div>
			</form>
		</div>
	);
};

export default CreateCommunity;
