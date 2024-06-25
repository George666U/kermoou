import { Link } from 'react-router-dom';
import './CarProfile.css';
import { ChatBubbleBottomCenterTextIcon, HeartIcon } from '@heroicons/react/24/outline';
import { mapDriveType, mapEngineType, mapTransmissionType } from '../../utils/utils';
import { useAuth } from '../../providers/authProvider';

const CarProfile = ({ car }) => {
	const { user: currentUser } = useAuth();
	return (
		<div className="car-profile">
			<div className="car-profile__hero">
				<img
					src={
						car.profile_picture ??
						'https://cdn.dribbble.com/users/24011/screenshots/979429/media/61bbf9ad007815bba511d8e6fa7132a0.gif?resize=400x0'
					}
					className="car-profile__hero__image"
					alt="car icon"
				/>
				<div className="car-profile__hero--overlay-bottom">
					<span>{car.car_make + ' ' + car.car_model}</span>
					<span>
						{currentUser?.user_id === car.user.user_id && (
							<Link
								to={`/car/${car.car_id}/edit`}
								className="car-profile__hero--overlay-bottom-edit">
								Редагувати автомобіль
							</Link>
						)}
					</span>
				</div>
			</div>
			<div className="car-profile__section">
				<div className="car-profile__header">
					<img src={car.user.profile_picture} alt="user pic" className="car-profile-user-pic" />
					<div>
						<Link to={`/users/${car.user.user_id}`}>
							<h3 className="car-profile-user-username">{car.user.username}</h3>
						</Link>
						<span>
							Їжджу на{' '}
							<Link
								to={`/car/${car.user.cars[0]?.car_id}`}
								className="full-post__content__author-car">
								{car.user.cars[0]?.car_make} {car.user.cars[0]?.car_model}
							</Link>
						</span>
					</div>
				</div>
				<div className="car-profile__about">
					<h4>Про автомобіль</h4>
					<span>{car.about}</span>
				</div>
				<div className="car-profile__stats">
					<h4>Характеристики</h4>
					<div className="car-profile__stats__list">
						<div className="car-profile__stats__list__item">
							<span>
								{car.car_make} {car.car_model}, {car.color}
							</span>
						</div>
						<div className="car-profile__stats__list__item">
							<span>Зійшов із конвеєра у {car.car_year} році</span>
						</div>
						<div className="car-profile__stats__list__item">
							<span>Придбаний у {car.buy_year} році</span>
						</div>
						<div className="car-profile__stats__list__item">
							<span>
								Двигун: {mapEngineType(car.engine_type)} (
								{Math.round(car.engine_displacement / 1000).toFixed(1)} л.), {car.engine_power} к.с.
							</span>
						</div>
						<div className="car-profile__stats__list__item">
							<span>Коробка: {mapTransmissionType(car.transmission_type)}</span>
						</div>
						<div className="car-profile__stats__list__item">
							<span>Привід: {mapDriveType(car.drive_type)}</span>
						</div>
					</div>
				</div>
				<div className="">
					<h4>Бортжурнал ({car?.posts.length})</h4>
					<div className="car-profile__logs__list">
						{car.posts.map((post) => (
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

export default CarProfile;
