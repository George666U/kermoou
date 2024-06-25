import { Link } from 'react-router-dom';
import './CommunityCard.css';

import { UsersIcon } from '@heroicons/react/24/outline';

const CommunityCard = ({ community }) => {
	return (
		<div className="community-card">
			<div className="community-card__users">
				<UsersIcon width={24} height={24} />
				<span>{community.member_count}</span>
			</div>
			<Link to={`/communities/${community.community_id}`}>
				<img src={community.profile_picture} alt="comm pic" className="community-card-pic" />
			</Link>
			<div>
				<Link to={`/communities/${community.community_id}`} className="community-card-title-link">
					{community.title}
				</Link>
			</div>
		</div>
	);
};

export default CommunityCard;
