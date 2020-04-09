/**
 * Internal dependencies
 */
const { spawnScript } = require( './cli' );
const { getWebpackArgs } = require( './config' );
const {
	buildWordPress,
	downloadWordPressZip,
	mergeYAMLConfigs,
} = require( './env' );
const { fromConfigRoot } = require( './file' );

module.exports = {
	buildWordPress,
	downloadWordPressZip,
	fromConfigRoot,
	getWebpackArgs,
	mergeYAMLConfigs,
	spawnScript,
};
