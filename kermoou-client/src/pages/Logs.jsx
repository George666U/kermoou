import { useEffect, useRef, useState } from 'react';
import PostCard from '../components/PostCard/PostCard';
import PostBigCard from '../components/PostBigCard/PostBigCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { carsList } from '../utils/utils';

const Logs = () => {
	const selectCarModelRef = useRef(null);

	const [searchFilter, setSearchFilter] = useState(null);
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('submit');
		setSearchFilter(true);

		const formData = new FormData(e.target);
		const data = {};

		for (let [key, value] of formData.entries()) {
			if (value !== '') data[key] = value;
		}

		setSearchFilter(data);
	};

	const [logs, setLogs] = useState([]);

	const fetchLogs = async (filter) => {
		try {
			const response = await axios.get('/api/post/logbooks', { params: filter });
			setLogs(response.data.posts);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchLogs(searchFilter);
	}, [searchFilter]);

	return (
		<div className="wrapper">
			<div className="logs-heading">
				<h3>Бортжурнали</h3>{' '}
				<Link to={`/logs/add`} className="logs-button">
					Додати запис
				</Link>
			</div>
			<form onSubmit={handleSubmit} className="logs-filterform">
				<div className="logs__filter">
					<div className="logs__filter-labels">
						<label htmlFor="car_make">Марка</label>
						<label htmlFor="car_model">Модель</label>
						<label htmlFor="car_year">Рік випуску</label>
						<label htmlFor="engine_type">Тип двигуна</label>
						<label htmlFor="transmission_type">Трансмісія</label>
						<label htmlFor="drive_type">Привід</label>
					</div>
					<div>
						<div className="logs__filter-items">
							<select
								id="car_make"
								name="car_make"
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

							<select id="car_model" name="car_model" ref={selectCarModelRef}>
								<option value="">вибрати...</option>
							</select>

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

							<select id="engine_type" name="engine_type">
								<option value="">вибрати...</option>
								<option value="petrol">Бензин</option>
								<option value="diesel">Дизель</option>
								<option value="hybrid">Гібрид</option>
								<option value="electric">Електро</option>
							</select>

							<select id="transmission_type" name="transmission_type">
								<option value="">вибрати...</option>
								<option value="manual">Механіка</option>
								<option value="automatic">Автомат</option>
								<option value="robot">Робот</option>
							</select>

							<select id="drive_type" name="drive_type">
								<option value="">вибрати...</option>
								<option value="front">Передній</option>
								<option value="rear">Задній</option>
								<option value="all">Повний</option>
							</select>
						</div>
					</div>
				</div>
				<button type="submit" className="logs-button">
					Знайти
				</button>
			</form>
			{!searchFilter && (
				<>
					<h4>Нещодавно додані</h4>
					<div className="post-grid">
						{logs.map((post) => (
							<PostCard key={post.post_id} post={post} />
						))}
					</div>
				</>
			)}
			{searchFilter && (
				<>
					<h4>Результати пошуку</h4>
					<div className="post-list">
						{logs.map((post) => (
							<PostBigCard key={post.post_id} post={post} />
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Logs;
