import '../styles/CreateCarProfile.css';

import { useRef, useState } from 'react';
import { carsList, colorList } from '../utils/utils';
import axios from 'axios';
import { toast } from 'react-toastify';

const CalcCarPrice = () => {
	const [carPrice, setCarPrice] = useState(null);
	const selectCarModelRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = {};

		for (let [key, value] of formData.entries()) {
			if (value !== '') data[key] = value;
		}

		data.car_year && (data.car_year = parseInt(data.car_year));
		data.mileage && (data.mileage = parseInt(data.mileage));
		data.engine_displacement && (data.engine_displacement = parseInt(data.engine_displacement));

		const predictPromise = async () => {
			const response = await axios.post('/api/predict/car-price', data);
			setCarPrice(response.data);
		};

		await toast.promise(predictPromise(), {
			loading: 'Обробка...',
			success: 'Ціна успішно обрахована',
			error: 'Помилка при обрахунку ціни',
		});
	};
	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit} className="addcar">
				<h3>Калькулятор вартості</h3>
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
						</div>
						<div className="addcar__item">
							<label htmlFor="car_year">Рік випуску</label>
							<select id="car_year" name="car_year">
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
						</div>
						<div className="addcar__item">
							<label htmlFor="mileage">Пробіг</label>
							<input id="mileage" name="mileage" type="number" defaultValue={0} />
						</div>
					</div>
				</div>
				{/* <div className="addcar__item">
					<h4>Фото</h4>
					<button className="addcar__item-button">Завантажити фото</button>
				</div> */}
				<div className="addcar__section">
					<h4>Характеристики</h4>
					<div className="addcar__section__div">
						<div className="addcar__item">
							<label htmlFor="engine_type">Тип двигуна</label>
							<select id="engine_type" name="engine_type" required>
								<option value="">вибрати...</option>
								<option value="Petrol">Бензин</option>
								<option value="Diesel">Дизель</option>
								<option value="Hybrid">Гібрид</option>
								{/* <option value="electric">Електро</option> */}
							</select>
						</div>
						<div className="addcar__item">
							<label htmlFor="engine_displacement">Об&apos;єм двигуна, см2</label>
							<input
								id="engine_displacement"
								name="engine_displacement"
								type="number"
								defaultValue={0}
								required
							/>
						</div>
						<div className="addcar__item">
							<label htmlFor="">Трансмісія</label>
							<select id="transmission_type" name="transmission_type" required>
								<option value="">вибрати...</option>
								<option value="Manual">Механіка</option>
								<option value="Automatic">Автомат</option>
								{/* <option value="robot">Робот</option> */}
							</select>
						</div>
					</div>
				</div>
				<div>
					<h3 style={{ textAlign: 'center' }}>
						Ціна на дане авто може складати: {carPrice ? <b>{carPrice}</b> : '...'} $
					</h3>
				</div>
				<div className="addcar__item addcar__item-full">
					<button className="addcar__item-save-button">Обрахувати</button>
				</div>
			</form>
		</div>
	);
};

export default CalcCarPrice;
