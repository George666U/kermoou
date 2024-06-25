import { Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import AuthLayout from './components/Layout/AuthLayout';
import Layout from './components/Layout/Layout';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import AllPosts from './pages/AllPosts';
import Logs from './pages/Logs';
import LogBook from './pages/LogBook';
import Blogs from './pages/Blogs';
import Blog from './pages/Blog';
import Communities from './pages/Communities';
import Community from './pages/Community';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import CarProfile from './pages/CarProfile';
import Settings from './pages/Settings';
import CreateCarProfile from './pages/CreateCarProfile';
import CreateLog from './pages/CreateLog';
import CreateBlog from './pages/CreateBlog';
import CreateCommunity from './pages/CreateCommunity';
import CalcCarPrice from './pages/CalcCarPrice';
import { ProtectedRoute } from './components/ProtectedRoute';
import EditCarProfile from './pages/EditCarProfile';

function App() {
	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Slide}
			/>
			<Routes>
				<Route element={<AuthLayout />}>
					<Route path="/signin" element={<SignIn />} />
					<Route path="/register" element={<Register />} />
				</Route>
				<Route element={<Layout />}>
					<Route path="/logs" element={<Logs />} />
					<Route path="/logs/:post_id" element={<LogBook />} />
					<Route path="/blogs" element={<Blogs />} />
					<Route path="/blogs/:post_id" element={<Blog />} />
					<Route path="/communities" element={<Communities />} />
					<Route path="/communities/:community_id" element={<Community />} />
					<Route path="/users" element={<Users />} />
					<Route path="/users/:user_id" element={<UserProfile />} />
					<Route path="/car/:car_id" element={<CarProfile />} />
					<Route path="/car/:car_id/edit" element={<EditCarProfile />} />
					<Route path="/calc" element={<CalcCarPrice />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/logs/add" element={<CreateLog />} />
						<Route path="/blogs/add" element={<CreateBlog />} />
						<Route path="/communities/add" element={<CreateCommunity />} />
						<Route path="/car/add" element={<CreateCarProfile />} />
						<Route path="/settings" element={<Settings />} />
					</Route>

					<Route path="*" element={<AllPosts />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
