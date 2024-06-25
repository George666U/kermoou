import { Link } from 'react-router-dom';
import PostBigCard from '../components/PostBigCard/PostBigCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Blogs = () => {
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

	const [blogs, setBlogs] = useState([]);

	const fetchBlogs = async (filter) => {
		try {
			const response = await axios.get('/api/post/blogs', { params: filter });
			setBlogs(response.data.posts);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchBlogs(searchFilter);
	}, [searchFilter]);

	return (
		<div className="wrapper">
			<div className="blogs-wrap">
				<div className="blogs__main">
					<div className="logs-heading">
						<h3>Блоги</h3>
						<Link to={`/blogs/add`} className="logs-button">
							Додати запис
						</Link>
					</div>
					<div className="post-list">
						{blogs?.map((post) => (
							<PostBigCard key={post.post_id} post={post} />
						))}
					</div>
				</div>
				<div className="blogs__filter">
					<form onSubmit={handleSubmit} className="blogs__filterform">
						<div className="blogs__filterform-item">
							<label htmlFor="post_type">Категорія</label>
							<select id="post_type" name="post_type">
								<option value="">вибрати...</option>
								<option value="news">Новина</option>
								<option value="advice">Порада</option>
								<option value="event">Подія</option>
								<option value="adventure">Подорожі</option>
								<option value="diy">DIY</option>
								<option value="review">Огляд</option>
								<option value="story">Історія</option>
								<option value="other">Інше</option>
							</select>
						</div>
						<button type="submit" className="logs-button">
							Знайти
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Blogs;
