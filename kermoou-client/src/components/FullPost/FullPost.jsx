import './FullPost.css';

import {
	BookmarkIcon,
	ChatBubbleBottomCenterTextIcon,
	HeartIcon,
} from '@heroicons/react/24/outline';
import {
	HeartIcon as HeartIconSolid,
	BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/authProvider';
import axios from 'axios';
import { useState } from 'react';
import { mapPostType } from '../../utils/utils';
import { toast } from 'react-toastify';

const FullPost = ({ post }) => {
	const { user } = useAuth();
	const [isLiked, setIsLiked] = useState(
		post.likes?.some((like) => like.user_id === user?.user_id),
	);
	const [isBookmarked, setIsBookmarked] = useState(
		post.bookmarked_by?.some((userb) => userb.user_id === user?.user_id),
	);

	const [comments, setComments] = useState(
		post.comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
	);

	const handleToggleLike = async () => {
		if (!user) return;
		try {
			if (isLiked) {
				post.likes = post.likes.filter((like) => like.user_id !== user.user_id);
				setIsLiked(false);
				await axios.delete(`/api/post/${post.post_id}/like`);
			} else {
				post.likes.push({ user_id: user.user_id });
				setIsLiked(true);
				await axios.post(`/api/post/${post.post_id}/like`);
			}
		} catch (error) {
			console.error(error);
			toast.error('Помилка зміни лайку!');
		}
	};

	const handleToggleBookmark = async () => {
		try {
			if (isBookmarked) {
				user.post_bookmarks = user.post_bookmarks.filter(
					(bookmark) => bookmark.post_id !== post.post_id,
				);
				setIsBookmarked(false);
				await axios.delete(`/api/post/${post.post_id}/bookmark`);
			} else {
				user.post_bookmarks.push({ post_id: post.post_id });
				setIsBookmarked(true);
				await axios.post(`/api/post/${post.post_id}/bookmark`);
			}
		} catch (error) {
			console.error(error);
			toast.error('Помилка зміни закладки!');
		}
	};

	const handleComment = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = {};

		for (let [key, value] of formData.entries()) {
			if (value !== '') data[key] = value;
		}

		const createPromise = async () => {
			const response = await axios.post(`/api/post/${post.post_id}/comment`, data);
			console.log(response.data);
			setComments([response.data, ...comments]);
			e.target.reset();
		};

		await toast.promise(createPromise(), {
			loading: 'Завантаження...',
			success: 'Коментар додано!',
			error: 'Помилка при додаванні коментаря',
		});
	};

	return (
		<div className="full-post">
			{post?.car && (
				<Link to={`/car/${post.car.car_id}`} className="full-post-car">
					{post.car.car_make} {post.car.car_model}
				</Link>
			)}
			<h2 className="full-post-title">{post.title}</h2>
			<div className="full-post__content">
				<div className="full-post__content__author">
					<img
						src={post.author.profile_picture}
						alt="author pic"
						className="full-post__content__author-pic"
					/>
					<div className="full-post__content__author-details">
						<Link
							to={`/users/${post.author.user_id}`}
							className="full-post__content__author-username">
							{post.author.username}
						</Link>
						<span>
							Їжджу на{' '}
							<Link
								to={`/car/${post.author?.cars[0]?.car_id}`}
								className="full-post__content__author-car">
								{post.author?.cars[0].car_make} {post.author?.cars[0].car_model}
							</Link>
						</span>
						<span className="full-post__content__author-about">{post.author.about}</span>
					</div>
				</div>
				<div>
					{post.images?.map((image, index) => (
						<div key={index} className="full-post__content__icon">
							<img
								src={image?.image_url}
								alt="post icon"
								className="full-post__content__icon-img"
							/>
							<span className="full-post__content__icon-label">Фото {index + 1}</span>
						</div>
					))}
				</div>
				<div className="full-post__content__content">
					<p>{post.content}</p>
					<span>Опубліковано: {new Date(post.created_at).toLocaleString('uk-ua')}</span>
					{post.community?.community_id ? (
						<span>
							Спільнота:{' '}
							<b>
								<Link to={`/communities/${post.community.community_id}`}>
									{post.community?.title}
								</Link>
							</b>
						</span>
					) : null}
					<span>
						Категорія: <b>{mapPostType(post.post_type)}</b>
					</span>
					<div className="full-post__content__interactions">
						<div className="post-card__details__info__item">
							<div className="post-card__details__info__item">
								{isLiked ? (
									<button onClick={handleToggleLike}>
										<HeartIconSolid height={24} width={24} />
									</button>
								) : (
									<button onClick={handleToggleLike}>
										<HeartIcon height={24} width={24} />
									</button>
								)}
								<span>{post.likes?.length}</span>
							</div>
							<div className="post-card__details__info__item">
								<ChatBubbleBottomCenterTextIcon height={24} width={24} />
								<span>{post.comments?.length}</span>
							</div>
						</div>
						<div className="post-card__details__info__item">
							{user?.user_id &&
								(isBookmarked ? (
									<button onClick={handleToggleBookmark}>
										<BookmarkIconSolid height={24} width={24} />
									</button>
								) : (
									<button onClick={handleToggleBookmark}>
										<BookmarkIcon height={24} width={24} />
									</button>
								))}
						</div>
					</div>
				</div>
			</div>
			<div className="full-post__comments">
				<div className="full-post__comments-headline">
					<ChatBubbleBottomCenterTextIcon height={32} width={32} />
					<h3 className="full-post__comments-headline-text">Коментарі</h3>
				</div>
				{!user ? (
					<span>
						Щоб залишати коментарі потрібно{' '}
						<Link to={`/signin`} className="full-post__comments-auth">
							авторизуватись
						</Link>
						.
					</span>
				) : (
					<form onSubmit={handleComment} className="full-post__comments__form">
						<div className="full-post__comments__form__container">
							<img src={user.profile_picture} alt="" className="full-post__comments__user-pic" />
							<textarea
								className="full-post__comments__form__input"
								rows={3}
								name="content"
								placeholder="Напишіть коментар"
							/>
							<button className="full-post__comments__submit">Відправити</button>
						</div>
					</form>
				)}
				<div className="full-post__comments-list">
					{comments?.map((comment, index) => (
						<div key={index} className="full-post__comments__comment">
							<div className="full-post__comments__comment__author">
								<img
									src={comment.user.profile_picture}
									alt="author pic"
									className="full-post__comments__comment__author-pic"
								/>
								<div className="full-post__comments__comment__author-details">
									<Link
										to={`/users/${comment.user.user_id}`}
										className="full-post__comments__comment__author-username">
										{comment.user.username}
									</Link>
									<span>
										Їжджу на{' '}
										<Link
											to={`/car/${comment.user?.cars[0]?.car_id}`}
											className="full-post__comments__comment__author-car">
											{comment.user?.cars[0]?.car_make} {comment.user?.cars[0]?.car_model}
										</Link>
									</span>
									<span className="full-post__comments__comment__author-about">
										{comment.user.about}
									</span>
								</div>
							</div>
							<div className="full-post__comments__comment__content">
								<p className="full-post__comments__comment__content-text">{comment.content}</p>
								<span className="full-post__comments__comment__content-time">
									{new Date(comment.created_at).toLocaleString('uk-ua')}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FullPost;
