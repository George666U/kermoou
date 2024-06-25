import './PostCard.css';
import { Link } from 'react-router-dom';

import { ChatBubbleBottomCenterTextIcon, HeartIcon } from '@heroicons/react/24/outline';
import { mapPostType } from '../../utils/utils';

const PostCard = ({ post }) => {
	const type = post.post_type === 'logbook' ? 'logs' : 'blogs';
	return (
		<div className="post-card">
			<div className="post-card--preview">
				<Link to={`/${type}/${post.post_id}`}>
					<img
						src={
							post.images?.[0]?.image_url ??
							'https://cdn.dribbble.com/users/1318871/screenshots/11046678/media/5c24ee4d43eaec7c0429b835bd9e8e2b.jpg?resize=400x300&vertical=center'
						}
						className="post-card--preview__image"
						alt="post icon"
					/>
				</Link>
				<div className="post-card--overlay-top">{mapPostType(post.post_type)}</div>
				<div className="post-card--overlay-bottom">
					{type === 'logs' ? post.car.car_make + ' ' + post.car.car_model : post.title}
				</div>
			</div>
			<Link to={`/${type}/${post.post_id}`} className="post-card__details-title">
				{post.title}
			</Link>
			<Link to={`/${type}/${post.post_id}`} className="post-card__details-description">
				{post.content}
			</Link>
			<Link to={`/users/${post.author.username}`} className="post-card__details-author">
				{post.author.username}
			</Link>
			<div className="post-card__details__info">
				<span>{new Date(post.created_at).toLocaleString('uk-ua')}</span>
				<div className="post-card__details__info__item">
					<div className="post-card__details__info__item">
						<HeartIcon height={24} width={24} />
						<span>{post.like_count}</span>
					</div>
					<div className="post-card__details__info__item">
						<ChatBubbleBottomCenterTextIcon height={24} width={24} />
						<span>{post.comment_count}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
