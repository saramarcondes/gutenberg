/**
 * External dependencies
 */
const spawn = require( 'cross-spawn' );

const { fromScriptsRoot, hasScriptFile } = require( './file' );

/**
 * Internal dependencies
 */
const { exit } = require( './process' );

const handleSignal = ( signal ) => {
	if ( signal === 'SIGKILL' ) {
		// eslint-disable-next-line no-console
		console.log(
			'The script failed because the process exited too early. ' +
				'This probably means the system ran out of memory or someone called ' +
				'`kill -9` on the process.'
		);
	} else if ( signal === 'SIGTERM' ) {
		// eslint-disable-next-line no-console
		console.log(
			'The script failed because the process exited too early. ' +
				'Someone might have called `kill` or `killall`, or the system could ' +
				'be shutting down.'
		);
	}
	exit( 1 );
};

const spawnScript = ( scriptName, args = [] ) => {
	if ( ! scriptName ) {
		// eslint-disable-next-line no-console
		console.log( 'Script name is missing.' );
		exit( 1 );
	}

	if ( ! hasScriptFile( scriptName ) ) {
		// eslint-disable-next-line no-console
		console.log(
			'Unknown script "' +
				scriptName +
				'". ' +
				'Perhaps you need to update @wordpress/scripts?'
		);
		exit( 1 );
	}

	const { signal, status } = spawn.sync(
		'node',
		[ fromScriptsRoot( scriptName ), ...args ],
		{
			stdio: 'inherit',
		}
	);

	if ( signal ) {
		handleSignal( signal );
	}

	exit( status );
};

module.exports = {
	spawnScript,
};
