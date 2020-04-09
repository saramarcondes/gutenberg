#!/usr/bin/env node

/**
 * Internal dependencies
 */
const { getArgsFromCLI } = require( '@wordpress/scripts-utils' );

/**
 * Internal dependencies
 */
const { spawnScript } = require( '../utils' );

const [ scriptName, ...nodesArgs ] = getArgsFromCLI();

spawnScript( scriptName, nodesArgs );
