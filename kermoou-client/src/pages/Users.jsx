import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard/UserCard';
import axios from 'axios';

const Users = () => {
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

	const [users, setUsers] = useState([]);

	const fetchUsers = async (filter) => {
		try {
			const response = await axios.get('/api/user/', { params: filter });
			setUsers(response.data.users);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUsers(searchFilter);
	}, [searchFilter]);

	return (
		<div className="wrapper">
			<div className="users">
				<div className="logs-heading">
					<h3>Користувачі</h3>
				</div>
				<form onSubmit={handleSubmit} className="users__filterform">
					<input name="search" type="text" placeholder="Пошук користувачів..." />
					<button type="submit" className="users__filterform-button">
						Знайти
					</button>
				</form>
				<div className="post-grid">
					{users?.map((user) => (
						<UserCard key={user.user_id} user={user} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Users;
