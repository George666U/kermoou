import '../styles/Community.css';

import PostBigCard from '../components/PostBigCard/PostBigCard';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../providers/authProvider';

const Community = () => {
	const { community_id } = useParams();
	const { user } = useAuth();
	const [community, setCommunity] = useState(null);
	const [isMember, setIsMember] = useState(
		user?.communities?.some((community) => community.community_id == community_id),
	);

	const fetchCommunity = async (community_id) => {
		try {
			const response = await axios.get('/api/community/' + community_id);
			setCommunity(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleJoin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('/api/community/' + community_id + '/join');
			fetchCommunity(community_id);
			setIsMember(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleLeave = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('/api/community/' + community_id + '/leave');
			fetchCommunity(community_id);
			setIsMember(false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCommunity(community_id);
	}, [community_id]);

	return (
		<div className="wrapper">
			{community ? (
				<div className="blogs-wrap">
					<div className="blogs__main">
						<div className="logs-heading">
							<h3>{community.title.toUpperCase()}</h3>
						</div>
						<div className="community__about">
							<h4>Про спільноту</h4>
							<span>{community.about}</span>
						</div>
						<div className="post-list">
							{community.posts?.map((post) => (
								<PostBigCard key={post.post_id} post={post} />
							))}
						</div>
					</div>
					<div className="community__details">
						<form onSubmit={() => {}} className="community__details__form">
							<div>
								<img
									src={community.profile_picture}
									alt=""
									className="community__details__form-img"
								/>
							</div>
							<span className="community__details__form-title">{community.title}</span>
							<span>Учасники: {community.members?.length}</span>
							<div className="community__details__form__users">
								{community.members?.slice(0, 9).map((user) => (
									<Link
										to={`/users/${user.user_id}`}
										key={user.user_id}
										className="community__details__form__users-user">
										<img src={user.profile_picture} alt="" />
										<span>{user.username}</span>
									</Link>
								))}
							</div>
							{user &&
								(isMember ? (
									<button onClick={handleLeave} className="logs-button">
										Вийти
									</button>
								) : (
									<button onClick={handleJoin} className="logs-button">
										Приєднатись
									</button>
								))}
						</form>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Community;
