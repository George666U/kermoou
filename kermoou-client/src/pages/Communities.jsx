import { Link } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard/CommunityCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Communities = () => {
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

	const [communities, setCommunitites] = useState([]);

	const fetchCommunitites = async (filter) => {
		try {
			const response = await axios.get('/api/community/', { params: filter });
			setCommunitites(response.data.communities);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCommunitites(searchFilter);
	}, [searchFilter]);

	return (
		<div className="wrapper">
			<div className="communities">
				<div className="logs-heading">
					<h3>Спільноти</h3>{' '}
					<Link to={`/communities/add`} className="logs-button">
						Створити спільноту
					</Link>
				</div>
				<form onSubmit={handleSubmit} className="communities__filterform">
					<input name="search" type="text" placeholder="Пошук спільнот..." />
					<button type="submit" className="communities__filterform-button">
						Знайти
					</button>
				</form>
				<div className="post-grid">
					{communities?.map((community) => (
						<CommunityCard key={community.community_id} community={community} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Communities;
