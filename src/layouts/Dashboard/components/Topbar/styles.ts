import { createStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { Badge } from '@material-ui/core';

export const StyledBadge = withStyles((theme: Theme) =>
	createStyles({
		badge: {
			backgroundColor: theme.palette.background.default,
			color: theme.palette.background.default,
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			'&::after': {
				position: 'absolute',
				// top: 0,
				// left: 0,
				width: '100%',
				height: '100%',
				borderRadius: '50%',
				animation: '$ripple 1.2s infinite ease-in-out',
				border: '1px solid currentColor',
				content: '""',
			},
		},
		'@keyframes ripple': {
			'0%': {
				transform: 'scale(.8)',
				opacity: 1,
			},
			'100%': {
				transform: 'scale(2.4)',
				opacity: 0,
			},
		},
	}),
)(Badge);
