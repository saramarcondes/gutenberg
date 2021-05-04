/**
 * External dependencies
 */
// eslint-disable-next-line no-restricted-imports
import type * as React from 'react';

/**
 * Based on https://github.com/reakit/reakit/blob/master/packages/reakit-utils/src/types.ts
 *
 * The `children` prop is being explicitely omitted since it is otherwise implicitly added
 * by `ComponentPropsWithRef`. The context is that components should require the `children`
 * prop explicitely when needed (see https://github.com/WordPress/gutenberg/pull/31817).
 */
export type PolymorphicComponentProps< P, T extends React.ElementType > = P &
	Omit< React.ComponentPropsWithRef< T >, 'as' | keyof P | 'children' > & {
		as?: T | keyof JSX.IntrinsicElements;
	};

export type ElementTypeFromPolymorphicComponentProps<
	P
> = P extends PolymorphicComponentProps< unknown, infer T > ? T : never;

export type PropsFromPolymorphicComponentProps<
	P
> = P extends PolymorphicComponentProps< infer PP, any > ? PP : never;

export type PolymorphicComponent< T extends React.ElementType, O > = {
	< TT extends React.ElementType >(
		props: PolymorphicComponentProps< O, TT > & { as: TT }
	): JSX.Element | null;
	( props: PolymorphicComponentProps< O, T > ): JSX.Element | null;
	displayName?: string;
	/**
	 * A CSS selector used to fake component interpolation in styled components
	 * for components not generated by `styled`. Anything passed to `contextConnect`
	 * will get this property.
	 *
	 * We restrict it to a class to align with the already existing class names that
	 * are generated by the context system.
	 */
	selector: `.${ string }`;
};

export type ForwardedRef< TElement extends HTMLElement > =
	| ( ( instance: TElement | null ) => void )
	| React.MutableRefObject< TElement | null >
	| null;
