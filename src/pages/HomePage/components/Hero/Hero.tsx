import React, { useContext } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Button, Typography } from '@material-ui/core';
import { Image } from '@components/atoms';
import { SectionHeader } from '@components/molecules';
import { Section} from "@components/organisms";
import { ViewComponentProps } from '../../../../types/ViewComponentProps';

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      'url(https://assets.maccarianagency.com/the-front/illustrations/patterns-bg.svg) no-repeat left bottom',
    backgroundSize: 'contain',
    // backgroundColor: theme.palette.alternate.main,
  },
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
  cover: {
    position: 'relative',
    zIndex: 9,
    width: '100%',
    height: '100%',
  },
	image: {
		[theme.breakpoints.down('sm')]: {
			maxWidth: 500,
		},
	},
}));

const Hero = ({ className, ...rest }: ViewComponentProps): JSX.Element => {
	const classes = useStyles();

	const theme = useTheme();
	const isMd = useMediaQuery(theme.breakpoints.up('md'), {
		defaultMatches: true,
	});

	const handleLogin = () =>
		window.location.replace(`${process.env.ALMOND_API}/auth/google`);

	// const ButtonGoToDashboard = () => (
	// 	<>
	// 		{authService.isAuthenticated() ? (
	// 			<NavLink to={isArrayNotNull(devices) ? '/dashboard' : '/my-device'}>
	// 				<Button variant="contained" color="primary">
	// 					Go to dashboard
	// 				</Button>
	// 			</NavLink>
	// 		) : (
	// 			<Button onClick={handleLogin} variant="contained" color="primary">
	// 				Create Account
	// 			</Button>
	// 		)}
	// 	</>
	// );

	return (
		<div className={clsx(classes.root, className)} {...rest}>
      <Section className={classes.pagePaddingTop}>
			<Grid container justify="space-between" spacing={isMd ? 4 : 2}>
				<Grid item xs={12} md={6} data-aos="fade-up">
					<SectionHeader
						title={
							<span>
								Welcome to{' '}
								<Typography component="span" variant="inherit" color="primary">
									Almond.
								</Typography>
								<br />
								<span>Grow your food and live happily healthy.</span>
							</span>
						}
						subtitle="Focus on the safe production of fresh food from your own home all year round."
						ctaGroup={[
						  <NavLink to="/shop">
							<Button variant="contained" color="primary">
								SHOP
							</Button>
              </NavLink>,
						]}
						align={isMd ? 'left' : 'center'}
						disableGutter
						titleVariant="h3"
					/>
				</Grid>
				<Grid
					item
					container
					justify="center"
					alignItems="center"
					xs={12}
					md={6}
					data-aos="fade-up"
				>
					<Image
						src="https://assets.maccarianagency.com/the-front/illustrations/want-to-work.svg"
						alt="Almond Hydroponics"
						className={classes.image}
					/>
				</Grid>
			</Grid>
      </Section>
		</div>
	);
};

export default Hero;
