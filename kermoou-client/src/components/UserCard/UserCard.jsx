import { Link } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ user }) => {
	return (
		<div className="user-card">
			<Link to={`/users/${user.user_id}`}>
				<img src={user.profile_picture} alt="user pic" className="user-card-pic" />
			</Link>
			<div>
				<Link to={`/users/${user.user_id}`} className="user-card-title-link">
					{user.username}
				</Link>
			</div>
		</div>
	);
};

export default UserCard;
