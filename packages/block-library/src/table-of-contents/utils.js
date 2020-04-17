/**
 * @typedef WPHeadingData
 *
 * @property {string} anchor  The anchor link to the heading, or '' if none.
 * @property {string} content The plain text content of the heading.
 * @property {number} level   The heading level.
 */

/**
 * @typedef WPNestedHeadingData
 *
 * @property {WPHeadingData}               heading  The heading content, anchor,
 *                                                  and level.
 * @property {number}                      index    The index of this heading
 *                                                  node in the entire nested
 *                                                  list of heading data.
 * @property {?Array<WPNestedHeadingData>} children The sub-headings of this
 *                                                  heading, if any.
 */

/**
 * Takes a flat list of heading parameters and nests them based on each header's
 * immediate parent's level.
 *
 * @param {WPHeadingData[]} headingList The flat list of headings to nest.
 * @param {number}          index       The current list index.
 *
 * @return {WPNestedHeadingData[]} The nested list of headings.
 */
export function linearToNestedHeadingList( headingList, index = 0 ) {
	const nestedHeadingList = [];

	headingList.forEach( ( heading, key ) => {
		if ( heading.content === '' ) {
			return;
		}

		// Make sure we are only working with the same level as the first iteration in our set.
		if ( heading.level === headingList[ 0 ].level ) {
			// Check that the next iteration will return a value.
			// If it does and the next level is greater than the current level,
			// the next iteration becomes a child of the current interation.
			if (
				headingList[ key + 1 ] !== undefined &&
				headingList[ key + 1 ].level > heading.level
			) {
				// We need to calculate the last index before the next iteration that has the same level (siblings).
				// We then use this last index to slice the array for use in recursion.
				// This prevents duplicate nodes.
				let endOfSlice = headingList.length;
				for ( let i = key + 1; i < headingList.length; i++ ) {
					if ( headingList[ i ].level === heading.level ) {
						endOfSlice = i;
						break;
					}
				}

				// We found a child node: Push a new node onto the return array with children.
				nestedHeadingList.push( {
					heading,
					index: index + key,
					children: linearToNestedHeadingList(
						headingList.slice( key + 1, endOfSlice ),
						index + key + 1
					),
				} );
			} else {
				// No child node: Push a new node onto the return array.
				nestedHeadingList.push( {
					heading,
					index: index + key,
					children: null,
				} );
			}
		}
	} );

	return nestedHeadingList;
}

/**
 * Extracts text, anchor, and level from a list of heading elements.
 *
 * @param {NodeList} headingElements The list of heading elements.
 *
 * @return {WPHeadingData[]} The list of heading parameters.
 */
export function getHeadingsFromHeadingElements( headingElements ) {
	return [ ...headingElements ].map( ( heading ) => {
		let anchor = '';

		if ( heading.hasAttribute( 'id' ) ) {
			// The id attribute may contain many ids, so just use the first.
			anchor = heading
				.getAttribute( 'id' )
				.trim()
				.split( '' )[ 0 ];
		}

		let level;

		switch ( heading.tagName ) {
			case 'H1':
				level = 1;
				break;
			case 'H2':
				level = 2;
				break;
			case 'H3':
				level = 3;
				break;
			case 'H4':
				level = 4;
				break;
			case 'H5':
				level = 5;
				break;
			case 'H6':
				level = 6;
				break;
		}

		return { anchor, content: heading.textContent, level };
	} );
}
