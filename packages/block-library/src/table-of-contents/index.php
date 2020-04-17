<?php
/**
 * Server-side rendering of the `core/table-of-contents` block.
 *
 * @package gutenberg
 */

/**
 * Extracts heading content, anchor, and level from the post content.
 *
 * @access private
 *
 * @return array The list of headings.
 */
function block_core_table_of_contents_get_headings() {
	/* phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase */
	// Disabled because of PHP DOMDoument and DOMXPath APIs using camelCase.

	global $post;

	/**
	 * Helper function to remove the children of a node.
	 *
	 * @param object $node The node to remove children from.
	 */
	function delete_node_children( $node ) {
		// Whenever the 1st child node is removed, the 2nd one becomes the 1st.
		while ( isset( $node->firstChild ) ) {
			delete_node_children( $node->firstChild );
			$node->removeChild( $node->firstChild );
		}
	}

	/**
	 * Helper function to remove a node and all of its children.
	 *
	 * @param object $node The node to remove along with its children.
	 */
	function delete_node_and_children( $node ) {
		delete_node_children( $node );
		$node->parentNode->removeChild( $node );
	}

	// Create a document to load the post content into.
	$doc = new DOMDocument();

	// Parse the post content into an HTML document.
	$doc->loadHTML(
		mb_convert_encoding(
			'<!DOCTYPE html><html><head><title>:D</title><body>' .
				$post->post_content .
				'</body></html>',
			'HTML-ENTITIES',
			'UTF-8'
		)
	);

	$document_el = $doc->documentElement;

	// Get iframes so we can remove them and their children. Otherwise heading
	// tags inside them would be counted.
	$iframes = $document_el->getElementsByTagName( 'iframe' );

	// We can't use foreach directly on the $iframes DOMNodeList because it's a
	// dynamic list, and removing nodes confuses the foreach iterator. So
	// instead, we create a static array of the nodes we want to remove and then
	// iterate over that.
	$iframes_to_remove = iterator_to_array( $iframes );
	foreach ( $iframes_to_remove as $iframe ) {
		delete_node_and_children( $iframe );
	}

	$xpath = new DOMXPath( $doc );

	// Get all heading elements in the post content.
	$headings = iterator_to_array(
		$xpath->query(
			'//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]'
		)
	);

	return array_map(
		function ( $heading ) {
			$anchor = '';

			if ( isset( $heading->attributes ) ) {
				$id_attribute = $heading->attributes->getNamedItem( 'id' );

				if ( null !== $id_attribute ) {
					// The id attribute may contain many ids, so just use the first.
					$anchor = explode( ' ', trim( $id_attribute->nodeValue ) )[0];
				}
			}

			switch ( $heading->nodeName ) {
				case 'h1':
					$level = 1;
					break;
				case 'h2':
					$level = 2;
					break;
				case 'h3':
					$level = 3;
					break;
				case 'h4':
					$level = 4;
					break;
				case 'h5':
					$level = 5;
					break;
				case 'h6':
					$level = 6;
					break;
			}

			return array(
				'anchor'  => $anchor,
				'content' => $heading->textContent,
				'level'   => $level,
			);
		},
		$headings
	);
	/* phpcs:enable */
}

/**
 * Converts a flat list of heading parameters to a hierarchical nested list
 * based on each header's immediate parent's level.
 *
 * @access private
 *
 * @param array $heading_list Flat list of heading parameters to nest.
 * @param int   $index        The current list index.
 *
 * @return array A hierarchical nested list of heading parameters.
 */
function block_core_table_of_contents_linear_to_nested_heading_list(
	$heading_list,
	$index = 0
) {
	$nested_heading_list = array();

	foreach ( $heading_list as $key => $heading ) {
		if ( ! isset( $heading['content'] ) ) {
			break;
		}

		// Make sure we are only working with the same level as the first
		// iteration in our set.
		if ( $heading['level'] === $heading_list[0]['level'] ) {
			// Check that the next iteration will return a value.
			// If it does and the next level is greater than the current level,
			// the next iteration becomes a child of the current interation.
			if (
				isset( $heading_list[ $key + 1 ] ) &&
				$heading_list[ $key + 1 ]['level'] > $heading['level']
			) {
				// We need to calculate the last index before the next iteration
				// that has the same level (siblings). We then use this last index
				// to slice the array for use in recursion. This prevents duplicate
				// nodes.
				$heading_list_length = count( $heading_list );
				$end_of_slice        = $heading_list_length;
				for ( $i = $key + 1; $i < $heading_list_length; $i++ ) {
					if ( $heading_list[ $i ]['level'] === $heading['level'] ) {
						$end_of_slice = $i;
						break;
					}
				}

				// Found a child node: Push a new node onto the return array with
				// children.
				$nested_heading_list[] = array(
					'heading'  => $heading,
					'index'    => $index + $key,
					'children' => block_core_table_of_contents_linear_to_nested_heading_list(
						array_slice(
							$heading_list,
							$key + 1,
							$end_of_slice - ( $key + 1 )
						),
						$index + $key + 1
					),
				);
			} else {
				// No child node: Push a new node onto the return array.
				$nested_heading_list[] = array(
					'heading'  => $heading,
					'index'    => $index + $key,
					'children' => null,
				);
			}
		}
	}

	return $nested_heading_list;
}

/**
 * Renders the heading list of the `core/table-of-contents` block on server.
 *
 * @access private
 *
 * @param array $nested_heading_list Nested list of heading data.
 *
 * @return string The heading list rendered as HTML.
 */
function block_core_table_of_contents_render_list( $nested_heading_list ) {
	$entry_class = 'wp-block-table-of-contents__entry';

	$child_nodes = array_map(
		function ( $child_node ) use ( $entry_class ) {
			$anchor  = $child_node['heading']['anchor'];
			$content = $child_node['heading']['content'];

			if ( isset( $anchor ) && '' !== $anchor ) {
				$entry = sprintf(
					'<a class="%1$s" href="#%2$s">%3$s</a>',
					$entry_class,
					esc_attr( $anchor ),
					esc_html( $content )
				);
			} else {
				$entry = sprintf(
					'<span class="%1$s">%2$s</span>',
					$entry_class,
					esc_html( $content )
				);
			}

			return sprintf(
				'<li>%1$s%2$s</li>',
				$entry,
				$child_node['children']
					? block_core_table_of_contents_render_list( $child_node['children'] )
					: null
			);
		},
		$nested_heading_list
	);

	return '<ul>' . implode( $child_nodes ) . '</ul>';
}

/**
 * Renders the `core/table-of-contents` block on server.
 *
 * @access private
 *
 * @param array $attributes The block attributes.
 *
 * @return string Rendered block HTML.
 */
function render_block_core_table_of_contents( $attributes ) {
	// CSS class string.
	$class = 'wp-block-table-of-contents';

	// Add custom CSS classes to class string.
	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}

	$headings = block_core_table_of_contents_get_headings();

	if ( count( $headings ) === 0 ) {
		return '';
	}

	return sprintf(
		'<nav class="%1$s">%2$s</nav>',
		esc_attr( $class ),
		block_core_table_of_contents_render_list(
			block_core_table_of_contents_linear_to_nested_heading_list( $headings )
		)
	);
}

/**
 * Registers the `core/table-of-contents` block on server.
 *
 * @access private
 *
 * @uses render_block_core_table_of_contents()
 *
 * @throws WP_Error An exception parsing the block definition.
 */
function register_block_core_table_of_contents() {
	register_block_type_from_metadata(
		__DIR__ . '/table-of-contents',
		array(
			'render_callback' => 'render_block_core_table_of_contents',
		)
	);
}
add_action( 'init', 'register_block_core_table_of_contents' );
