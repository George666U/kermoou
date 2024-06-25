import '../styles/CreateBlog.css';
import { useAuth } from '../providers/authProvider';
import { useEffect, useState } from 'react';
import { filetobase64 } from '../utils/utils';
import axios, { formToJSON } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const fetchUser = async (user_id) => {
	const response = await axios.get('/api/user/' + user_id);
	return response.data;
};

const CreateBlog = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [uploadedImages, setUploadedImages] = useState([]);
	const [userDetails, setUserDetails] = useState(null);

	const handleImageUpload = async (e) => {
		//add each new image to uploadedImages
		const files = e.target.files;
		const newImages = await Promise.all(Array.from(files).map(filetobase64));
		setUploadedImages([...newImages]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let data = formToJSON(e.target);

		for (let [key, value] of Object.entries(data)) {
			if (value == '' || value?.name == '') delete data[key];
		}

		data.community_id && (data.community_id = parseInt(data.community_id));

		if (data.images && !data.images?.length) {
			data.images = [data.images];
		}

		const createPromise = async () => {
			if (data?.images?.length > 0) {
				const staticUrl = '/api/file/uploads';

				for (let i = 0; i < data.images.length; i++) {
					const formDataImage = new FormData();
					formDataImage.append('file', data.images[i]);

					const response = await axios.post(staticUrl, formDataImage);
					const filename = response.data.filename;
					data.images[i] = staticUrl + '/' + filename;
				}
			}

			const response = await axios.post('/api/post/', data);
			navigate(`/blogs/${response.data.post_id}`);
		};

		await toast.promise(createPromise, {
			pending: 'Створення...',
			success: 'Блог успішно створено!',
			error: 'Помилка створення блогу',
		});
	};

	useEffect(() => {
		fetchUser(user.user_id).then((userDetails) => setUserDetails(userDetails));
	}, [user.user_id]);
	return (
		<div className="wrapper">
			<form onSubmit={handleSubmit} className="addblog">
				<h3>Новий блог</h3>
				<div className="addblog__item">
					<label htmlFor="">Категорія</label>
					<select id="post_type" name="post_type" required>
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
				<div className="addblog__item">
					<label htmlFor="title">Назва допису</label>
					<input id="title" name="title" type="text" required />
				</div>
				<div className="addblog__item">
					<label htmlFor="">У спільноту</label>
					<select id="community_id" name="community_id">
						<option value="">вибрати...</option>
						{userDetails?.communities?.map((community) => (
							<option key={community.community_id} value={community.community_id}>
								{community.title}
							</option>
						))}
					</select>
				</div>
				<div className="addblog__item addblog__item-full">
					<label>Фото</label>
					<div>
						<input
							onChange={handleImageUpload}
							type="file"
							accept="image/*"
							multiple
							name="images"
							id="images"
						/>
						{/* <button className="addblog__item-button">Завантажити фото</button> */}
					</div>
					{uploadedImages.length > 0 && (
						<div className="addblog__item__images">
							{uploadedImages.map((image, index) => (
								<img key={index} src={image} />
							))}
						</div>
					)}
				</div>
				<div className="addblog__item addblog__item-full">
					<label htmlFor="content">Розповідь</label>
					<textarea id="content" name="content" required />
				</div>
				<div className="addblog__item addblog__item-full">
					<button className="addblog__item-save-button">Опублікувати</button>
				</div>
			</form>
		</div>
	);
};

export default CreateBlog;
