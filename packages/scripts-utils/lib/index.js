/**
 * Internal dependencies
 */
const {
	getArgFromCLI,
	getArgsFromCLI,
	getFileArgsFromCLI,
	hasArgInCLI,
	hasFileArgInCLI,
} = require( './cli' );
const {
	hasBabelConfig,
	hasJestConfig,
	hasPrettierConfig,
} = require( './config' );
const { fromProjectRoot, hasProjectFile } = require( './file' );
const { hasPackageProp } = require( './package' );
const { camelCaseDash } = require( './string' );

module.exports = {
	camelCaseDash,
	fromProjectRoot,
	getArgFromCLI,
	getArgsFromCLI,
	getFileArgsFromCLI,
	hasBabelConfig,
	hasArgInCLI,
	hasFileArgInCLI,
	hasJestConfig,
	hasPackageProp,
	hasPrettierConfig,
	hasProjectFile,
};
