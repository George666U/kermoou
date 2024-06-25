import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard/PostCard';
import axios from 'axios';

const AllPosts = () => {
	const [posts, setPosts] = useState([]);

	const fetchPosts = async () => {
		try {
			const response = await axios.get('/api/post/');
			setPosts(response.data.posts);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<div className="wrapper">
			<h3>Нещодавно додані</h3>
			<div className="post-grid">
				{posts.map((post) => (
					<PostCard key={post.post_id} post={post} />
				))}
			</div>
		</div>
	);
};

export default AllPosts;
