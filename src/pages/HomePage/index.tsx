import { useContext } from 'react';
// thunks
import { UserContext } from '@context/UserContext';
// third party apps
import { NavLink } from 'react-router-dom';
import { Button, colors } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// components
import { Hero } from '@pages/HomePage/components';
import { Section } from '@components/organisms';
// helpers
import authService from '@utils/auth';
import isArrayNotNull from '@utils/checkArrayEmpty';
import logo from '../../assets/images/logo.png';
// images
import homepage from '../../assets/images/homepage.svg';

const useStyles = makeStyles((theme) => ({
	pagePaddingTop: {
		paddingTop: theme.spacing(3),
		[theme.breakpoints.up('md')]: {
			paddingTop: theme.spacing(5),
		},
	},
	sectionNoPaddingTop: {
		paddingTop: 0,
	},
	shape: {
		background: theme.palette.alternate.main,
		borderBottomRightRadius: '100%',
		borderBottom: `1px solid ${colors.grey[200]}`,
	},
}));

export const HomePage = (): JSX.Element => {
	const classes = useStyles();

	return (
		<div data-testid="homepage">
			<Hero />
		</div>
	);
};

export default HomePage;
