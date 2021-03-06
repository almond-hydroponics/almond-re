import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	IconButton,
	Grid,
	List,
	ListItem,
} from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';

import { Image } from '@components/atoms';

import fancyId from '@utils/fancyId';
import { MenuGroupProps, PagesProps } from '../../../interfaces';

const logo = 'https://static.almondhydroponics.com/static/logo.png';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(6, 0),
		[theme.breakpoints.up('md')]: {
			padding: theme.spacing(12, 0),
		},
		background: theme.palette.background.footer,
	},
	footerContainer: {
		maxWidth: theme.layout.contentWidth,
		width: '100%',
		margin: '0 auto',
		padding: theme.spacing(0, 2),
		[theme.breakpoints.up('sm')]: {
			padding: theme.spacing(0, 8),
		},
	},
	logoContainerItem: {
		paddingTop: 0,
	},
	logoContainer: {
		width: '10%',
		height: '10%',
		[theme.breakpoints.up('md')]: {
			width: '35%',
			height: '35%',
		},
	},
	logoImage: {
		width: '100%',
		height: '100%',
		[theme.breakpoints.up('md')]: {
			width: '60%',
			height: '60%',
		},
	},
	groupTitle: {
		textTransform: 'uppercase',
		color: theme.palette.primary.dark,
		marginBottom: theme.spacing(1),
	},
	socialIcon: {
		padding: 0,
		marginRight: theme.spacing(1),
		// color: 'rgba(255,255,255,.6)',
		'&:hover': {
			background: 'transparent',
		},
		'&:last-child': {
			marginRight: 0,
		},
	},
	icon: {
		fontSize: 34,
	},
	menuListContainer: {
		padding: '0 !important',
	},
	menu: {
		display: 'flex',
	},
	menuItem: {
		margin: theme.spacing(2),
		'&:last-child': {
			marginBottom: 0,
		},
	},
	menuGroupItem: {
		paddingTop: 0,
		paddingBottom: theme.spacing(1 / 2),
		'&:last-child': {
			paddingBottom: 0,
		},
	},
	menuGroupTitle: {
		color: theme.palette.text.primary,
		fontWeight: 'bold',
	},
	divider: {
		width: '100%',
	},
	navLink: {
		color: theme.palette.text.primary,
		fontSize: 14,
	},
}));

interface Props {
	className?: string;
	pages: PagesProps;
}

const Footer = ({ pages, className, ...rest }: Props): JSX.Element => {
	const classes = useStyles();

	const { discover, learn, support } = pages;

	const MenuGroup = ({ item }: MenuGroupProps): JSX.Element => (
		<List disablePadding className={classes.menuItem}>
			<ListItem disableGutters className={classes.menuGroupItem}>
				<Typography variant="body1" className={classes.menuGroupTitle}>
					{item.groupTitle}
				</Typography>
			</ListItem>
			{item.pages.map((page) => (
				<ListItem
					disableGutters
					key={fancyId()}
					className={classes.menuGroupItem}
				>
					<NavLink to={page.href}>
						<Typography
							variant="body1"
							className={clsx(classes.navLink, 'submenu-item')}
						>
							{page.title}
						</Typography>
					</NavLink>
				</ListItem>
			))}
		</List>
	);

	const DiscoverPages = (): JSX.Element => {
		const { about } = discover.children;
		return (
			<div className={classes.menu}>
				<div>
					<MenuGroup item={about} />
				</div>
			</div>
		);
	};

	const LearnPages = (): JSX.Element => {
		const { resources } = learn.children;
		return (
			<div className={classes.menu}>
				<div>
					<MenuGroup item={resources} />
				</div>
			</div>
		);
	};

	const SupportPages = (): JSX.Element => {
		const { services } = support.children;
		return (
			<div className={classes.menu}>
				<div>
					<MenuGroup item={services} />
				</div>
			</div>
		);
	};

	return (
		<div {...rest} className={clsx(classes.root, className)}>
			<div className={classes.footerContainer}>
				<Grid container spacing={4}>
					<Grid item xs={12} md={2}>
						<List disablePadding>
							<ListItem disableGutters className={classes.logoContainerItem}>
								<div className={classes.logoContainer}>
									<NavLink to="/">
										<Image
											className={classes.logoImage}
											src={logo}
											alt="almond"
											lazy={false}
										/>
									</NavLink>
								</div>
							</ListItem>
							<ListItem disableGutters>
								<IconButton className={classes.socialIcon}>
									<FacebookIcon className={classes.icon} />
								</IconButton>
								<IconButton className={classes.socialIcon}>
									<InstagramIcon className={classes.icon} />
								</IconButton>
								<IconButton className={classes.socialIcon}>
									<TwitterIcon className={classes.icon} />
								</IconButton>
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={12} md={10} className={classes.menuListContainer}>
						<Grid container spacing={0} justifyContent="space-evenly">
							<Grid item>
								<DiscoverPages />
							</Grid>
							<Grid item>
								<LearnPages />
							</Grid>
							<Grid item>
								<SupportPages />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default Footer;
