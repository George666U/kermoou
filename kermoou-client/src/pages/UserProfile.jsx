import { useParams } from 'react-router-dom';
import UserProfileComponent from '../components/UserProfile/UserProfile';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
	const { user_id } = useParams();
	const [user, setUser] = useState(null);

	const fetchUser = async (user_id) => {
		try {
			const response = await axios.get('/api/user/' + user_id);
			setUser(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUser(user_id);
	}, [user_id]);

	return <div className="wrapper">{user && <UserProfileComponent user={user} />}</div>;
};

export default UserProfile;
