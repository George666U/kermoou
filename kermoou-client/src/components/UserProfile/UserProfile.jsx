import { Link } from 'react-router-dom';
import './UserProfile.css';

import {
	ChatBubbleBottomCenterTextIcon,
	DocumentTextIcon,
	HeartIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../providers/authProvider';

const UserProfile = ({ user }) => {
	const { user: currentUser } = useAuth();
	return (
		<div className="user-profile">
			<h2>Профіль {user.username}</h2>
			<div className="user-profile__section">
				<div className="user-profile__header">
					<img src={user.profile_picture} alt="user pic" className="user-profile-pic" />
					<div>
						<h3 className="user-profile-username">{user.username}</h3>
						<span>
							Їжджу на{' '}
							<Link to={`/car/${user.cars[0]?.car_id}`} className="full-post__content__author-car">
								{user.cars[0]?.car_make} {user.cars[0]?.car_model}
							</Link>
						</span>
					</div>
				</div>
				<div className="user-profile__about">
					<h4>Про мене</h4>
					<span>{user.about}</span>
				</div>
				<div className="user-profile__stats">
					<div className="user-profile__stats__list">
						<div className="user-profile__stats__list__item">
							<span>
								На сайті з {new Date(user.created_at).toLocaleString('uk-ua').slice(0, 10)}
							</span>
						</div>
						<div className="user-profile__stats__list__item">
							<span>Опубліковано {user.posts?.length} постів</span>
						</div>
						<div className="user-profile__stats__list__item">
							<span>Залишено {user.post_comments?.length} коментарів</span>
						</div>
						<div className="user-profile__stats__list__item">
							<span>Учасник {user.communities?.length} спільнот</span>
						</div>
					</div>
				</div>
				<div className="user-profile__cars">
					<div className="user-profile__cars__heading">
						<h4>Мої автомобілі</h4>
						{currentUser?.user_id === user.user_id && (
							<Link to="/car/add" className="user-profile__cars__heading-add-car">
								Додати автомобіль
							</Link>
						)}
					</div>
					<div className="user-profile__cars__grid">
						{user.cars.map((car) => (
							<Link
								to={`/car/${car.car_id}`}
								key={car.car_id}
								className="user-profile__cars__grid__item">
								<img
									src={
										car.profile_picture ??
										'https://cdn.dribbble.com/users/24011/screenshots/979429/media/61bbf9ad007815bba511d8e6fa7132a0.gif?resize=400x0'
									}
									className="user-profile__cars__grid__item__image"
									alt="car icon"
								/>
								<div className="user-profile__cars__grid__item--overlay-side">
									<DocumentTextIcon width={18} height={18} />
									{car.post_count}
								</div>
								<div className="user-profile__cars__grid__item--overlay-bottom">
									{car.car_make + ' ' + car.car_model}
								</div>
							</Link>
						))}
					</div>
				</div>
				<div className="">
					<h4>Блоги ({user?.posts.filter((post) => post.post_type !== 'logbook').length})</h4>
					<div className="user-profile__logs__list">
						{user.posts
							.filter((post) => post.post_type !== 'logbook')
							.map((post) => (
								<Link
									to={`/${post.post_type === 'logbook' ? 'logs' : 'blogs'}/${post.post_id}`}
									key={post.post_id}
									className="car-profile__logs__list__item">
									<img
										src={
											post.images?.[0]?.image_url ??
											'https://cdn.dribbble.com/users/1318871/screenshots/11046678/media/5c24ee4d43eaec7c0429b835bd9e8e2b.jpg?resize=400x300&vertical=center'
										}
										alt=""
										className="car-profile__logs__list__item-image"
									/>
									<div className="car-profile__logs__list__item__info">
										<span className="car-profile__logs__list__item__info-title">{post.title}</span>
										<span className="">{new Date(post.created_at).toLocaleString('uk-ua')}</span>
									</div>
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
								</Link>
							))}
					</div>
				</div>
				<div className="">
					<h4>Закладки ({user?.bookmarks?.length})</h4>
					<div className="user-profile__logs__list">
						{user.bookmarks?.map((post) => (
							<Link
								to={`/${post.post_type === 'logbook' ? 'logs' : 'blogs'}/${post.post_id}`}
								key={post.post_id}
								className="car-profile__logs__list__item">
								<img
									src={
										post.images?.[0]?.image_url ??
										'https://cdn.dribbble.com/users/1318871/screenshots/11046678/media/5c24ee4d43eaec7c0429b835bd9e8e2b.jpg?resize=400x300&vertical=center'
									}
									alt=""
									className="car-profile__logs__list__item-image"
								/>
								<div className="car-profile__logs__list__item__info">
									<span className="car-profile__logs__list__item__info-title">{post.title}</span>
									<span className="">{new Date(post.created_at).toLocaleString('uk-ua')}</span>
								</div>
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
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
