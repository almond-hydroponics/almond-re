import { ReactNode } from 'react';

export interface IconAlternateProps {
	/**
	 * External classes
	 */
	className?: string;
	/**
	 * The classes of the font icon
	 */
	fontIconClass?: string;
	/**
	 * The classes of the font icon
	 */
	avatarIcon?: ReactNode;
	/**
	 * Sizes of the icon
	 */
	size?: 'extraSmall' | 'small' | 'medium' | 'large';
	/**
	 * Color of the icon
	 */
	color?: any;
	/**
	 * The shape of the alternate icon
	 */
	shape?: 'circle' | 'square';
	/**
	 * Additional properties to pass to the Icon component
	 */
	iconProps?: object;

	// All other props
	[x: string]: any;
}
