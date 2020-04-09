/**
 * Internal dependencies
 */
const { hasArgInCLI } = require( './cli' );
const { hasProjectFile } = require( './file' );
const { hasPackageProp } = require( './package' );

// See https://babeljs.io/docs/en/config-files#configuration-file-types
const hasBabelConfig = () =>
	hasProjectFile( '.babelrc.js' ) ||
	hasProjectFile( '.babelrc.json' ) ||
	hasProjectFile( 'babel.config.js' ) ||
	hasProjectFile( 'babel.config.json' ) ||
	hasProjectFile( '.babelrc' ) ||
	hasPackageProp( 'babel' );

const hasJestConfig = () =>
	hasArgInCLI( '-c' ) ||
	hasArgInCLI( '--config' ) ||
	hasProjectFile( 'jest.config.js' ) ||
	hasProjectFile( 'jest.config.json' ) ||
	hasPackageProp( 'jest' );

const hasPrettierConfig = () =>
	hasProjectFile( '.prettierrc.js' ) ||
	hasProjectFile( '.prettierrc.json' ) ||
	hasProjectFile( '.prettierrc.toml' ) ||
	hasProjectFile( '.prettierrc.yaml' ) ||
	hasProjectFile( '.prettierrc.yml' ) ||
	hasProjectFile( 'prettier.config.js' ) ||
	hasProjectFile( '.prettierrc' ) ||
	hasPackageProp( 'prettier' );

module.exports = {
	hasBabelConfig,
	hasJestConfig,
	hasPrettierConfig,
};
