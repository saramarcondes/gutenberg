/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { FooterUI } from '../styles';
import { useCardContext } from '../context';

export const defaultProps = {
	isBorderless: false,
	isShady: false,
	size: 'medium',
};

/**
 * @param { import('../types').FooterProps } props
 */
export function CardFooter( props ) {
	const { className, isShady, ...additionalProps } = props;
	const mergedProps = { ...defaultProps, ...useCardContext(), ...props };
	const { isBorderless, size } = mergedProps;

	const classes = classnames(
		'components-card__footer',
		isBorderless && 'is-borderless',
		isShady && 'is-shady',
		size && `is-size-${ size }`,
		className
	);

	return <FooterUI { ...additionalProps } className={ classes } />;
}

export default CardFooter;
