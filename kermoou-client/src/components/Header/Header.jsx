import { Link, useNavigate } from 'react-router-dom';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import styles from './Header.module.css';

import { useAuth } from '../../providers/authProvider';
import { useState } from 'react';

const Header = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	return (
		<div className={styles.wrapper}>
			<div className={'py-1 container grid-xl ' + styles.header}>
				<Link to={`/`} className={styles.logo_text}>
					KERMOOU.UA
				</Link>
				{!user ? (
					<div className={styles.navs}>
						<Link to={`/signin`} className={styles.signin_link}>
							Увійти
						</Link>
						<Link to={`/register`} className={styles.register_link}>
							Зареєструватись
						</Link>
					</div>
				) : (
					<div>
						<Popover
							isOpen={isPopoverOpen}
							positions={['bottom']}
							padding={10}
							onClickOutside={() => setIsPopoverOpen(false)}
							// ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
							content={({ position, childRect, popoverRect }) => (
								<ArrowContainer
									position={position}
									childRect={childRect}
									popoverRect={popoverRect}
									arrowColor={'#fff'}>
									<div onClick={() => setIsPopoverOpen(false)} className={styles.popover}>
										<div className={styles.popover_item}>
											<Link to={`/users/${user?.username}`} className={styles.popover_link}>
												Профіль
											</Link>
										</div>
										<div className={styles.popover_item}>
											<Link to={`/settings`} className={styles.popover_link}>
												Налаштування
											</Link>
										</div>
										<div className={styles.popover_item}>
											<button onClick={handleLogout} className={styles.popover_link}>
												Вийти
											</button>
										</div>
									</div>
								</ArrowContainer>
							)}>
							{user?.profile_picture ? (
								<img
									src={user.profile_picture}
									onClick={() => setIsPopoverOpen(true)}
									className={styles.profiledropdownicon}
								/>
							) : (
								<div
									onClick={() => setIsPopoverOpen(true)}
									className={styles.profiledropdownicon}
								/>
							)}
						</Popover>
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;
