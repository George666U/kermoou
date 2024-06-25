import { useParams } from 'react-router-dom';
import CarProfileComponent from '../components/CarProfile/CarProfile';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CarProfile = () => {
	const { car_id } = useParams();
	const [car, setCar] = useState(null);

	const fetchCar = async (car_id) => {
		try {
			const response = await axios.get('/api/user_car/' + car_id);
			setCar(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCar(car_id);
	}, [car_id]);
	return <div className="wrapper">{car && <CarProfileComponent car={car} />}</div>;
};

export default CarProfile;
