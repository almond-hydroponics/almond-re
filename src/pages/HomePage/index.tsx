import React, { useContext } from 'react';
// thunks
import { UserContext } from '@context/UserContext';
// third party apps
import { NavLink } from 'react-router-dom';
// components
import ActionButton from '@components/ActionButton';
// helpers
import { authService } from '@utils/auth';
import isArrayNotNull from '@utils/checkArrayEmpty';
// styles
import './HomePage.scss';
import Logo from '@components/Logo';
// images
import homepage from '../../assets/images/homepage.svg';

export const HomePage = (): JSX.Element => {
	const user = useContext(UserContext);
	const { devices } = user;
	const handleLogin = () =>
		window.location.replace(`${process.env.ALMOND_API}/auth/google`);

	const renderGoToDashboard = () => (
		<>
			{authService.isAuthenticated() ? (
				<NavLink to={isArrayNotNull(devices) ? '/dashboard' : '/my-device'}>
					<ActionButton name="Go to dashboard" variant="contained" />
				</NavLink>
			) : (
				<ActionButton
					name="Login with Google"
					handleClick={handleLogin}
					variant="contained"
				/>
			)}
		</>
	);
	return (
		<div className="background-cover" data-testid="homepage">
			<main className="home-cover">
				<section className="logo">
					<Logo />
				</section>
				<section className="home-image">
					<div className="image-wrapper">
						<img src={homepage} alt="Almond" />
					</div>
				</section>
				<section id="hero">
					<div className="hero-container">
						<div className="hero-info">
							<h1 data-testid="homepage-content">We have an idea!</h1>
							<h1>Grow hydroponically.</h1>
							<h2>Focusing on the safe production of fresh produce.</h2>
							{renderGoToDashboard()}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default HomePage;
