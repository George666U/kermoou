import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';

const baseNav = [
	{ title: 'Усі дописи', path: '/' },
	{ title: 'Бортжурнали', path: '/logs' },
	{ title: 'Блоги', path: '/blogs' },
	{ title: 'Спільноти', path: '/communities' },
	{ title: 'Користувачі', path: '/users' },
	{ title: 'Визначити вартість', path: '/calc' },
];

const SideNavbar = () => {
	const { user } = useAuth();
	const navs = useMemo(
		() => (user ? baseNav.concat({ title: 'Налаштування', path: '/settings' }) : baseNav),
		[user],
	);
	return (
		<div className="sidenav">
			{navs.map((nav, index) => (
				<NavLink
					key={index}
					to={nav.path}
					className={({ isActive }) => `sidenav__item ${isActive && 'active'}`}>
					<span>{nav.title}</span>
				</NavLink>
			))}
		</div>
	);
};

export default SideNavbar;
