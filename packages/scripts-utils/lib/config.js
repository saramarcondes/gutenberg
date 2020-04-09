/**
 * Internal dependencies
 */
const { hasArgInCLI } = require( './cli' );
const { hasProjectFile } = require( './file' );
const { hasPackageProp } = require( './package' );

/**
 * @see https://babeljs.io/docs/en/config-files#configuration-file-types
 */
const hasBabelConfig = () =>
	hasProjectFile( '.babelrc' ) ||
	hasProjectFile( '.babelrc.cjs' ) ||
	hasProjectFile( '.babelrc.js' ) ||
	hasProjectFile( '.babelrc.json' ) ||
	hasProjectFile( '.babelrc.mjs' ) ||
	hasProjectFile( 'babel.config.cjs' ) ||
	hasProjectFile( 'babel.config.js' ) ||
	hasProjectFile( 'babel.config.json' ) ||
	hasProjectFile( 'babel.config.mjs' ) ||
	hasPackageProp( 'babel' );

/**
 * @see https://jestjs.io/docs/en/configuration
 */
const hasJestConfig = () =>
	hasArgInCLI( '-c' ) ||
	hasArgInCLI( '--config' ) ||
	hasProjectFile( 'jest.config.cjs' ) ||
	hasProjectFile( 'jest.config.js' ) ||
	hasProjectFile( 'jest.config.json' ) ||
	hasProjectFile( 'jest.config.mjs' ) ||
	hasPackageProp( 'jest' );

/**
 * @see https://prettier.io/docs/en/configuration.html
 */
const hasPrettierConfig = () =>
	hasProjectFile( '.prettierrc' ) ||
	hasProjectFile( '.prettierrc.js' ) ||
	hasProjectFile( '.prettierrc.json' ) ||
	hasProjectFile( '.prettierrc.toml' ) ||
	hasProjectFile( '.prettierrc.yaml' ) ||
	hasProjectFile( '.prettierrc.yml' ) ||
	hasProjectFile( 'prettier.config.js' ) ||
	hasPackageProp( 'prettier' );

module.exports = {
	hasBabelConfig,
	hasJestConfig,
	hasPrettierConfig,
};
