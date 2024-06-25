import { useParams } from 'react-router-dom';
import FullPost from '../components/FullPost/FullPost';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {
	const { post_id } = useParams();
	const [post, setPost] = useState(null);

	const fetchPost = async (post_id) => {
		try {
			const response = await axios.get('/api/post/' + post_id);
			setPost(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPost(post_id);
	}, [post_id]);

	return <div className="wrapper">{post && <FullPost post={post} />}</div>;
};

export default Blog;
