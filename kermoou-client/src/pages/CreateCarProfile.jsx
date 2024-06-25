import { useNavigate } from 'react-router-dom';
import '../styles/CreateCarProfile.css';

import { useRef, useState } from 'react';
import { carsList, colorList, filetobase64 } from '../utils/utils';
import { useAuth } from '../providers/authProvider';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateCarProfile = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [uploadedImage, setUploadedImage] = useState(null);
	const selectCarModelRef = useRef(null);

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

		data.car_year && (data.car_year = parseInt(data.car_year));
		data.buy_year && (data.buy_year = parseInt(data.buy_year));
		data.mileage && (data.mileage = parseInt(data.mileage));
		data.engine_displacement && (data.engine_displacement = parseInt(data.engine_displacement));
		data.engine_power && (data.engine_power = parseInt(data.engine_power));

		const createPromise = async () => {
			if (data.avatar?.size > 0) {
				const staticUrl = '/api/file/uploads';
				const formDataAvatar = new FormData();
				formDataAvatar.append('file', data.avatar);

				const response = await axios.post(staticUrl, formDataAvatar);
				const filename = response.data.filename;
				data.profile_picture = staticUrl + '/' + filename;
			}

			const response = await axios.post('/api/user_car/', data);
			navigate(`/car/${response.data.car_id}`);
		};

		await toast.promise(createPromise, {
			pending: 'Додавання...',
			success: 'Автомобіль успішно додано!',
			error: 'Помилка додавання автомобіля',
		});
	};
	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit} className="addcar">
				<h3>Додавання авто</h3>
				<div className="addcar__section">
					<h4>Загальна інформація</h4>
					<div className="addcar__section__div">
						<div className="addcar__item">
							<label htmlFor="car_make">Марка</label>
							<select
								id="car_make"
								name="car_make"
								required
								onChange={(e) => {
									const selectedCar = e.target.value;
									const carModels = carsList[selectedCar];
									const selectCarModel = selectCarModelRef.current;
									selectCarModel.innerHTML = '';

									const option = document.createElement('option');
									option.value = '';
									option.innerText = 'вибрати...';
									selectCarModel.appendChild(option);

									carModels.sort().forEach((model) => {
										const option = document.createElement('option');
										option.value = model;
										option.innerText = model;
										selectCarModel.appendChild(option);
									});
								}}>
								<option value="">вибрати...</option>
								{Object.keys(carsList)
									.sort()
									.map((car) => (
										<option key={car} value={car}>
											{car}
										</option>
									))}
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="car_model">Модель</label>
							<select id="car_model" name="car_model" required ref={selectCarModelRef}>
								<option value="">вибрати...</option>
							</select>

							{/* <input id="car_model" name="car_model" type="text" /> */}
						</div>
						<div className="addcar__item">
							<label htmlFor="car_year">Рік випуску</label>
							<select id="car_year" name="car_year" required>
								<option value="">вибрати...</option>
								{Array.from(
									{ length: new Date().getFullYear() - 1900 },
									(v, k) => new Date().getFullYear() - k,
								).map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="buy_year">Рік покупки</label>
							<select id="buy_year" name="buy_year">
								<option value="">вибрати...</option>
								{Array.from(
									{ length: new Date().getFullYear() - 1900 },
									(v, k) => new Date().getFullYear() - k,
								).map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="color">Колір</label>
							<select id="color" name="color" required>
								<option value="">вибрати...</option>
								{colorList.map((color) => (
									<option key={color} value={color}>
										{color}
									</option>
								))}
							</select>
							{/* <input id="color" name="color" type="text" defaultValue={''} /> */}
						</div>
						<div className="addcar__item">
							<label htmlFor="mileage">Пробіг</label>
							<input id="mileage" name="mileage" type="number" step={1} defaultValue={0} />
						</div>
						<div className="addcar__item">
							<label htmlFor="license_plate">Номер реєстрації</label>
							<input id="license_plate" name="license_plate" type="text" defaultValue={''} />
						</div>
					</div>
				</div>
				<div className="addcar__item">
					<h4>Фото</h4>
					{/* <button className="addcar__item-button">Завантажити фото</button> */}
					<input
						onChange={handleImageUpload}
						type="file"
						accept="image/*"
						name="avatar"
						id="avatar"
					/>
					{uploadedImage && (
						<div className="addblog__item__images">
							<img src={uploadedImage} alt="" />
						</div>
					)}
				</div>
				<div className="addcar__section">
					<h4>Характеристики</h4>
					<div className="addcar__section__div">
						<div className="addcar__item">
							<label htmlFor="engine_type">Тип двигуна</label>
							<select id="engine_type" name="engine_type" required>
								<option value="">вибрати...</option>
								<option value="gasoline">Бензин</option>
								<option value="diesel">Дизель</option>
								<option value="hybrid">Гібрид</option>
								<option value="electric">Електро</option>
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="engine_displacement">Об&apos;єм двигуна, см2</label>
							<input
								id="engine_displacement"
								name="engine_displacement"
								type="number"
								step={1}
								defaultValue={0}
							/>
						</div>
						<div className="addcar__item">
							<label htmlFor="">Трансмісія</label>
							<select id="transmission_type" name="transmission_type">
								<option value="">вибрати...</option>
								<option value="manual">Механіка</option>
								<option value="automatic">Автомат</option>
								<option value="robot">Робот</option>
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="">Привід</label>
							<select id="drive_type" name="drive_type">
								<option value="">вибрати...</option>
								<option value="front">Передній</option>
								<option value="rear">Задній</option>
								<option value="all">Повний</option>
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="engine_power">Потужність двигуна, к.с.</label>
							<input
								id="engine_power"
								name="engine_power"
								type="number"
								step={1}
								defaultValue={0}
							/>
						</div>
					</div>
				</div>
				<div className="addcar__item addcar__item-full">
					<h4 htmlFor="about">Про автомобіль</h4>
					<textarea id="about" name="about" />
				</div>
				<div className="addcar__item addcar__item-full">
					<button className="addcar__item-save-button">Зберегти</button>
				</div>
			</form>
		</div>
	);
};

export default CreateCarProfile;
