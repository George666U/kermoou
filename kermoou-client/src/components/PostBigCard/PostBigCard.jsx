import './PostBigCard.css';

import { Link } from 'react-router-dom';

import { ChatBubbleBottomCenterTextIcon, HeartIcon } from '@heroicons/react/24/outline';
import { mapPostType } from '../../utils/utils';

const PostBigCard = ({ post }) => {
	const type = post.post_type === 'logbook' ? 'logs' : 'blogs';
	return (
		<div className="post-big-card">
			<div className="post-big-card_author-info">
				{type === 'logs' ? (
					<>
						<Link to={`/car/${post.car.car_id}`}>
							<img
								src={
									post.car.profile_picture ??
									'https://cdn.dribbble.com/users/24011/screenshots/979429/media/61bbf9ad007815bba511d8e6fa7132a0.gif?resize=400x0'
								}
								alt=""
								className="post-big-card_image"
							/>
						</Link>
						<Link to={`/car/${post.car.car_id}`}>
							<span>
								{post.car.car_make} {post.car?.car_model}
							</span>
						</Link>
					</>
				) : (
					<Link to={`/users/${post.author.username}`} className="post-card__details-author">
						<img src={post.author.profile_picture} alt="" className="post-big-card_author-pic" />
					</Link>
				)}
				<Link to={`/users/${post.author.username}`} className="post-card__details-author">
					{post.author.username}
				</Link>
				<span>
					<b>{mapPostType(post.post_type)}</b>
				</span>
				<span>{new Date(post.created_at).toLocaleString('uk-ua')}</span>
			</div>
			<div className="post-big-card_fields">
				<Link to={`/${type}/${post.post_id}`}>
					<img
						src={
							post.images?.[0]?.image_url ??
							'https://cdn.dribbble.com/users/1318871/screenshots/11046678/media/5c24ee4d43eaec7c0429b835bd9e8e2b.jpg?resize=400x300&vertical=center'
						}
						alt=""
						className="post-big-card__post-icon"
					/>
				</Link>
				<Link to={`/${type}/${post.post_id}`} className="post-card__details-title">
					{post.title}
				</Link>
				<Link to={`/${type}/${post.post_id}`} className="post-card__details-description">
					{post.content}
				</Link>
				<div className="post-card__details__info">
					<Link to={`/${type}/${post.post_id}`} className="post-big-card__link">
						Читати далі
					</Link>
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
		</div>
	);
};

export default PostBigCard;
