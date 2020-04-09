/**
 * WordPress dependencies
 */
const defaultPrettierConfig = require( '@wordpress/prettier-config' );
const { hasPrettierConfig } = require( '@wordpress/scripts-utils' );

const config = {
	extends: [
		require.resolve( './recommended-with-formatting.js' ),
		'plugin:prettier/recommended',
		'prettier/react',
	],
};

if ( ! hasPrettierConfig() ) {
	config.rules = {
		'prettier/prettier': [
			'error',
			defaultPrettierConfig,
			{
				usePrettierrc: false,
			},
		],
	};
}

module.exports = config;
