const { Logger, LEVELS } = require( './logger' );
const { FileLogStore } = require( './file-store' );
const LIST = new Map();

const singleton = {
	get( name, options = {} ) {
		if ( !LIST.has( name ) ) {
			options = Object.assign( { name }, options );
			if ( options.levels === 'all' ) {
				options.levels = LEVELS;
			}
			LIST.set( name, new Logger( options ) )
		}
		return LIST.get( name );
	}
};

module.exports = {
	logger: singleton,
	FileLogStore,
	LEVELS
};
