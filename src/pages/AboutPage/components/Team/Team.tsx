import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
	useMediaQuery,
	Grid,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
} from '@material-ui/core';
import { SectionHeader } from '@components/molecules';
import { CardBase } from '@components/organisms';
import fancyId from '@utils/fancyId';
import { ViewComponentProps } from '../../../../types/ViewComponentProps';

const useStyles = makeStyles((theme) => ({
	cardBase: {
		boxShadow: 'none',
		background: theme.palette.alternate.main,
		borderRadius: theme.spacing(1),
		'& .card-base__content': {
			padding: theme.spacing(1),
			[theme.breakpoints.up('sm')]: {
				padding: theme.spacing(3),
			},
		},
	},
	avatar: {
		width: 110,
		height: 110,
		border: `4px solid ${theme.palette.background.paper}`,
		borderRadius: '100%',
		boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.1)',
	},
	listItem: {
		padding: 0,
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
		},
	},
	listItemAvatar: {
		marginRight: theme.spacing(3),
		[theme.breakpoints.down('sm')]: {
			marginRight: 0,
			marginBottom: theme.spacing(2),
		},
	},
	listItemText: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		margin: 0,
		height: '100%',
	},
	title: {
		fontWeight: 'bold',
	},
}));

const Team = ({
	data,
	className,
	...rest
}: ViewComponentProps): JSX.Element => {
	const classes = useStyles();

	const theme = useTheme();
	const isMd = useMediaQuery(theme.breakpoints.up('md'), {
		defaultMatches: true,
	});

	return (
		<div className={className} {...rest}>
			<SectionHeader
				title="Meet the team"
				subtitle="These are the great farmers bring life to this great food revolution."
				align={isMd ? 'center' : 'left'}
			/>
			<Grid container spacing={isMd ? 2 : 1}>
				{data.map((item: any) => (
					<Grid item xs={6} key={fancyId()} data-aos="fade-up">
						<CardBase className={classes.cardBase} liftUp>
							<ListItem disableGutters className={classes.listItem}>
								<ListItemAvatar className={classes.listItemAvatar}>
									<Avatar {...item.authorPhoto} className={classes.avatar} />
								</ListItemAvatar>
								<ListItemText
									className={classes.listItemText}
									primary={item.authorName}
									secondary={item.title}
									primaryTypographyProps={{
										className: classes.title,
										variant: 'h6',
										align: isMd ? 'left' : 'center',
									}}
									secondaryTypographyProps={{
										color: 'textPrimary',
										align: isMd ? 'left' : 'center',
									}}
								/>
							</ListItem>
						</CardBase>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default Team;