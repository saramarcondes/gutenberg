/**
 * External dependencies
 */
const { isEqual } = require( 'lodash' );

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TableOfContentsList from './list';
import {
	getHeadingsFromHeadingElements,
	linearToNestedHeadingList,
} from './utils';

/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * @typedef WPTableOfContentsEditProps
 *
 * @param {string|undefined} className
 */

/**
 * Table of Contents block edit component.
 *
 * @param {WPTableOfContentsEditProps} props The props.
 *
 * @return {WPComponent} The component.
 */
export default function TableOfContentsEdit( { className } ) {
	// Local state; not saved to block attributes. The saved block is dynamic and uses PHP to generate its content.
	const [ headings, setHeadings ] = useState( [] );

	const postContent = useSelect( ( select ) => {
		return select( 'core/editor' ).getEditedPostContent();
	}, [] );

	useEffect( () => {
		// Create a temporary container to put the post content into, so we can
		// use the DOM to find all the headings.
		const tempPostContentDOM = document.createElement( 'div' );
		tempPostContentDOM.innerHTML = postContent;

		// Remove iframes so that headings inside them aren't counted.
		for ( const iframe of tempPostContentDOM.querySelectorAll(
			'iframe'
		) ) {
			tempPostContentDOM.removeChild( iframe );
		}

		const headingElements = tempPostContentDOM.querySelectorAll(
			'h1, h2, h3, h4, h5, h6'
		);

		const latestHeadings = getHeadingsFromHeadingElements(
			headingElements
		);

		if ( ! isEqual( headings, latestHeadings ) ) {
			setHeadings( latestHeadings );
		}
	}, [ postContent ] );

	if ( headings.length === 0 ) {
		return (
			<p>
				{ __(
					'Start adding Heading blocks to create a table of contents here.'
				) }
			</p>
		);
	}

	return (
		<div className={ className }>
			<TableOfContentsList
				nestedHeadingList={ linearToNestedHeadingList( headings ) }
			/>
		</div>
	);
}
