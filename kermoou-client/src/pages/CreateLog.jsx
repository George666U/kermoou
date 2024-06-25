import { Link, useNavigate } from 'react-router-dom';
import '../styles/CreateLog.css';
import { useAuth } from '../providers/authProvider';
import { useEffect, useState } from 'react';
import { filetobase64 } from '../utils/utils';
import axios, { formToJSON } from 'axios';
import { toast } from 'react-toastify';

const fetchUser = async (user_id) => {
	const response = await axios.get('/api/user/' + user_id);
	return response.data;
};

const CreateLog = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [uploadedImages, setUploadedImages] = useState([]);
	const [userDetails, setUserDetails] = useState(null);

	const handleImageUpload = async (e) => {
		//add each new image to uploadedImages
		const files = e.target.files;
		const newImages = await Promise.all(Array.from(files).map(filetobase64));
		setUploadedImages([...newImages]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let data = formToJSON(e.target);

		for (let [key, value] of Object.entries(data)) {
			if (value == '' || value?.name == '') delete data[key];
		}

		data.car_id = parseInt(data.car_id);
		data.post_type = 'logbook';

		if (data.images && !data.images?.length) {
			data.images = [data.images];
		}

		const createPromise = async () => {
			if (data?.images?.length > 0) {
				const staticUrl = '/api/file/uploads';

				for (let i = 0; i < data.images.length; i++) {
					const formDataImage = new FormData();
					formDataImage.append('file', data.images[i]);

					const response = await axios.post(staticUrl, formDataImage);
					const filename = response.data.filename;
					data.images[i] = staticUrl + '/' + filename;
				}
			}

			const response = await axios.post('/api/post/', data);
			navigate(`/logs/${response.data.post_id}`);
		};

		await toast.promise(createPromise, {
			pending: 'Створення...',
			success: 'Запис успішно створено!',
			error: 'Помилка створення запису',
		});
	};

	useEffect(() => {
		fetchUser(user.user_id).then((userDetails) => setUserDetails(userDetails));
	}, [user.user_id]);

	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit} className="addlog">
				<h3>Новий бортжурнал</h3>
				{userDetails &&
					(userDetails.cars?.length > 0 ? (
						<>
							<div className="addlog__item">
								<label htmlFor="">В журнал авто</label>
								<select id="car_id" name="car_id" required>
									{userDetails.cars?.map((car) => (
										<option key={car.car_id} value={car.car_id}>
											{car.car_make} {car.car_model}
										</option>
									))}
								</select>
							</div>
							<div className="addlog__item">
								<label htmlFor="title">Назва допису</label>
								<input id="title" name="title" type="text" required />
							</div>
							<div className="addblog__item addblog__item-full">
								<label>Фото</label>
								<div>
									<input
										onChange={handleImageUpload}
										type="file"
										accept="image/*"
										multiple
										name="images"
										id="images"
									/>
									{/* <button className="addblog__item-button">Завантажити фото</button> */}
								</div>
								{uploadedImages.length > 0 && (
									<div className="addblog__item__images">
										{uploadedImages.map((image, index) => (
											<img key={index} src={image} />
										))}
									</div>
								)}
							</div>
							<div className="addlog__item addlog__item-full">
								<label htmlFor="content">Розповідь</label>
								<textarea id="content" name="content" required />
							</div>
							<div className="addlog__item addlog__item-full">
								<button className="addlog__item-save-button">Опублікувати</button>
							</div>
						</>
					) : (
						<div className="addlog__item addblog__item-full">
							<span>
								Щоб створювати нові записи, спочатку потрібно{' '}
								<Link to="/car/add" className="addlog__item-link">
									додати своє авто
								</Link>
								.
							</span>
						</div>
					))}
			</form>
		</div>
	);
};

export default CreateLog;
