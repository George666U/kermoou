import { Outlet } from 'react-router-dom';

import Header from '../Header/Header';
import SideNavbar from '../SideNavbar';

const Layout = () => {
	return (
		<div className="mainlayout">
			<Header />
			<div className="mainlayout__content cols container">
				<div className="mainlayout__sidenav">
					<SideNavbar />
				</div>
				<div className="mainlayout__content__container">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default Layout;
