const DEFAULT_LEVELS = [ 'error', 'warn' ];
const LEVELS = [ 'info', 'error', 'warn', 'trace' ];

const { formattedDate } = require('../utils');
const { StdOutLogStore } = require('./stdout-store');

class Logger {
	
	constructor( options ) {
		
		this.name = options.name;
		this.dateFormat = options.dateFormat || 'YY-MM-DD hh:mm:ss:ms';
		this.store = options.store
							? options.store
							: new StdOutLogStore();
		
		Object.assign(
			this,
			getNOPs( Array.isArray( options.levels )
								? options.levels
								:  DEFAULT_LEVELS
			)
		);
		
	}
	
	info( ... args ) {
		this.store.send( getMessageRecord( 'INFO', this.dateFormat, this.name, arrToString( args ) ) );
	}
	
	trace( ... args ) {
		this.store.send( getMessageRecord( 'TRACE', this.dateFormat, this.name, arrToString( args ) ) );
	}
	
	warn( ... args ) {
		this.store.send( getMessageRecord( 'WARN', this.dateFormat, this.name, arrToString( args ) ) );
	}
	
	error( ... args ) {
		this.store.send( getMessageRecord( 'ERROR', this.dateFormat, this.name, arrToString( args ) ) );
	}
	
}

const nop = function(){};

function arrToString( arr ) {
	let message = '';
	if( Array.isArray( arr ) ) {
		arr.forEach( ( element )=> {
			if( element instanceof Error) {
				message += element.message + ' ';
			}
			else {
				message += String(element) +' ';
			}
		} );
	}
	else {
		message = String( arr );
	}
	return message;
}

function getNOPs( levels ) {
	const NOPs = { };
	for( const level of LEVELS ) {
		if( !levels.includes( level ) ) {
			NOPs[level] = nop;
		}
	}
	return NOPs;
}

function getMessageRecord( level, dateFormat, name, message ) {
	return `${level} ${ formattedDate( new Date(), dateFormat )} [${name}] ${ message }\n`
}

module.exports = {
	Logger,
	LEVELS
};
