import { useContext, cloneElement } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
	Toolbar,
	Hidden,
	List,
	ListItem,
	Typography,
	Button,
	Grid,
	Badge,
	CssBaseline,
	AppBar,
	useScrollTrigger,
	Divider,
} from '@material-ui/core';
import { Image, DarkModeToggler } from '@components/atoms';
import { UserContext } from '@context/UserContext';
import { NavLink } from 'react-router-dom';
import isArrayNotNull from '@utils/checkArrayEmpty';
import {
	ArrowDropDown,
	Notifications,
	NotificationsNone,
	Timeline,
} from '@material-ui/icons';
import { ComponentContext } from '@context/ComponentContext';
import { useMqttState } from '@hooks/mqtt';
// import { useMqttState } from 'mqtt-react-hooks';
import withStyles from '@material-ui/core/styles/withStyles';
import { CustomAvatar } from '@components/molecules';
import { StyledBadge } from './styles';
import {
	closedColor,
	connectedColor,
	offlineColor,
	reconnectingColor,
} from '../../../../assets/tss/common';
import { ElevationBarProps } from './interfaces';

const logo = 'https://static.almondhydroponics.com/static/logo.png';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	flexGrow: {
		flexGrow: 1,
	},
	flexGrowLeft: {
		flexGrow: 0,
	},
	navigationContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: 100,
	},
	toolbar: {
		zIndex: 999,
		maxWidth: '100%',
		width: '100%',
		margin: '0 auto',
		padding: theme.spacing(0, 2),
		[theme.breakpoints.up('sm')]: {
			padding: theme.spacing(0, 8),
		},
	},
	navLink: {
		'&:hover': {
			color: theme.palette.primary.main,
		},
	},
	listItem: {
		cursor: 'pointer',
		'&:hover > .menu-item, &:hover svg': {
			color: theme.palette.primary.main,
		},
		'&.menu-item--no-dropdown': {
			paddingRight: 0,
		},
	},
	listItemActive: {
		'&> .menu-item': {
			color: theme.palette.primary.main,
		},
	},
	listItemText: {
		flex: '0 0 auto',
		// marginLeft: theme.spacing(0),
		whiteSpace: 'nowrap',
	},
	listItemButton: {
		whiteSpace: 'nowrap',
	},
	listItemIcon: {
		minWidth: 'auto',
	},
	popover: {
		padding: theme.spacing(4),
		border: theme.spacing(2),
		boxShadow: '0 0.5rem 2rem 2px rgba(116, 123, 144, 0.09)',
		minWidth: 350,
		marginTop: theme.spacing(2),
	},
	iconButton: {
		marginLeft: theme.spacing(2),
		padding: 0,
		'&:hover': {
			background: 'transparent',
		},
	},
	expandOpen: {
		transform: 'rotate(180deg)',
		color: theme.palette.primary.dark,
	},
	logoContainer: {
		width: '10%',
		height: '10%',
		[theme.breakpoints.up('md')]: {
			width: '3%',
			height: '3%',
		},
	},
	container: {
		display: 'inline-flex',
		alignItems: 'center',
		flexFlow: 'row',
	},
	logoImage: {
		width: '100%',
		height: '100%',
		// [theme.breakpoints.up('md')]: {
		// 	width: '60%',
		// 	height: '60%',
		// },
	},
	menu: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	menuItem: {
		marginRight: theme.spacing(5),
		'&:last-child': {
			marginRight: 0,
		},
	},
	menuGroupItem: {
		paddingTop: 0,
	},
	menuGroupTitle: {
		textTransform: 'uppercase',
	},
	grow: {
		flexGrow: 1,
	},
	device: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		marginRight: theme.spacing(4),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(5),
			width: 'auto',
		},
	},
	deviceText: {
		color: '#fff',
		[theme.breakpoints.up('sm')]: {
			fontWeight: 500,
		},
	},
	topDevice: {
		position: 'relative',
		display: 'flex',
		maxWidth: 'fit-content',
		padding: '4px 40px',
		marginLeft: theme.spacing(12),
		marginRight: theme.spacing(4),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 'auto',
		},
		color: '#fff',
		backgroundColor: 'rgba(17, 17, 17, 0.8)',
		border: '1px solid #dadce0',
		borderRadius: theme.shape.borderRadius,
	},
	appBar: {
		backgroundColor: theme.palette.background.default,
		zIndex: theme.zIndex.drawer + 1,
	},
	leftContainer: {
		display: 'inline-flex',
		minWidth: 0,
		flex: '1 1 auto',
		alignItems: 'center',
		justifyContent: 'flex-start',
		order: -1,
	},
	sectionEnd: {
		display: 'inline-flex',
		justifyContent: 'flex-end',
		order: 1,
	},
}));

const ElevationScroll = ({
	window,
	children,
}: ElevationBarProps): JSX.Element => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined,
	});

	return cloneElement(children, {
		elevation: trigger ? 4 : 0,
	});
};

interface Props {
	className?: string;
	onSidebarOpen?: Function;
	themeMode: string;
	themeToggler: Function;
	isActivityLogsEmpty: any;
}

const Topbar = ({
	themeMode,
	themeToggler,
	onSidebarOpen,
	className,
	isActivityLogsEmpty,
	...rest
}: Props): JSX.Element => {
	const classes = useStyles();

	const {
		activityLogsViewed,
		toggleActivityDrawer,
		setDeviceModalOpen,
	} = useContext(ComponentContext);

	/*
	 * Status list
	 * - Offline
	 * - Connected
	 * - Reconnecting
	 * - Closed
	 * - Error
	 */
	const { connectionStatus } = useMqttState();

	const { activeDevice, isAdmin } = useContext(UserContext);

	const statusChange = (mqttStatus: string): string => {
		switch (mqttStatus) {
			case 'Connected':
				return connectedColor;
			case 'Reconnecting':
				return reconnectingColor;
			case 'Closed':
				return closedColor;
			case 'Offline':
				return offlineColor;
			default:
				return reconnectingColor;
		}
	};

	const DeviceActiveBadge = withStyles((theme: Theme) =>
		createStyles({
			badge: {
				backgroundColor: statusChange(connectionStatus as string),
				color: statusChange(connectionStatus as string),
				boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
				top: '50%',
				left: '-12%',
				'&::after': {
					position: 'absolute',
					width: '100%',
					height: '100%',
					borderRadius: '50%',
					// animation: '$ripple 1.2s infinite ease-in-out',
					border: '0.8px solid currentColor',
					content: '""',
				},
			},
		}),
	)(Badge);

	const renderDeviceDisplay = (): JSX.Element => {
		const handleClick = (): void => setDeviceModalOpen(true);
		const handleDeviceModal = (): void => setDeviceModalOpen(true);
		return (
			<Button
				variant="contained"
				size="small"
				onClick={handleClick}
				onKeyDown={handleDeviceModal}
				style={{
					paddingLeft: 36,
					marginLeft: '15%',
					backgroundColor: 'rgba(17, 17, 17, 0.8)',
				}}
			>
				<Grid
					container
					direction="row"
					justify="space-evenly"
					alignItems="center"
					spacing={2}
					style={{ margin: 0, padding: 0 }}
				>
					<DeviceActiveBadge
						variant="dot"
						overlap="circle"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
					>
						<Grid
							container
							direction="row"
							justify="space-evenly"
							alignItems="center"
							spacing={2}
							style={{ margin: 0, padding: 0 }}
						>
							<Typography
								variant="body2"
								className={clsx(classes.listItemText, classes.deviceText)}
								style={{ margin: 0, padding: 0 }}
							>
								{`Device ID: ${activeDevice?.id}`}
							</Typography>
							<ArrowDropDown onClick={handleClick} style={{ color: '#fff' }} />
						</Grid>
					</DeviceActiveBadge>
				</Grid>
			</Button>
		);
	};

	const renderTimeLineIcon = (): JSX.Element => {
		const handleClick = () => toggleActivityDrawer(true, true);
		return (
			<StyledBadge
				overlap="circle"
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				variant="dot"
				invisible={isActivityLogsEmpty !== activityLogsViewed}
			>
				<Timeline color="primary" onClick={handleClick} />
			</StyledBadge>
		);
	};

	// :TODO: Remove this after demoing the feature to be
	const notifications = ['true'];

	const renderNotificationsIcon = (): JSX.Element =>
		isArrayNotNull(notifications.length) ? (
			<NotificationsNone />
		) : (
			<StyledBadge
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				overlap="circle"
				invisible={isArrayNotNull(notifications.length)}
				variant="dot"
				color="primary"
			>
				<Notifications color="primary" />
			</StyledBadge>
		);

	return (
		<>
			<CssBaseline />
			<ElevationScroll {...rest}>
				<AppBar
					className={classes.appBar}
					position="fixed"
					elevation={0}
					data-testid="top-bar"
				>
					<Toolbar
						disableGutters
						className={classes.toolbar}
						{...rest}
						variant="dense"
					>
						<div className={classes.leftContainer}>
							<div className={classes.logoContainer}>
								<NavLink to="/">
									<Grid container className={classes.container}>
										<Image
											className={classes.logoImage}
											src={themeMode === 'light' ? logo : logo}
											alt="almond"
											lazy={false}
										/>
									</Grid>
								</NavLink>
							</div>
							<Hidden smDown>{!isAdmin && renderDeviceDisplay()}</Hidden>
						</div>
						<div className={classes.flexGrow} />
						<Hidden smDown>
							<List disablePadding className={classes.navigationContainer}>
								<ListItem className="menu-item--no-dropdown">
									<DarkModeToggler
										themeMode={themeMode}
										onChange={() => themeToggler()}
										size={24}
									/>
								</ListItem>
								<ListItem
									className={clsx(classes.listItem, 'menu-item--no-dropdown')}
								>
									<Hidden smDown>{!isAdmin && renderTimeLineIcon()}</Hidden>
								</ListItem>
								<ListItem
									className={clsx(classes.listItem, 'menu-item--no-dropdown')}
								>
									{renderNotificationsIcon()}
								</ListItem>
								<ListItem className={clsx(classes.listItem)}>
									<CustomAvatar />
								</ListItem>
							</List>
						</Hidden>
						<Hidden mdUp>
							<DarkModeToggler
								themeMode={themeMode}
								onChange={() => themeToggler()}
								size={24}
							/>
						</Hidden>
					</Toolbar>
					<Divider />
				</AppBar>
			</ElevationScroll>
		</>
	);
};

export default Topbar;
