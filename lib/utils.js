const fs = require('fs');
const Module = require('module');

const idCounter = new Uint32Array( 1 );
const dateParts = [ 'YY', 'MM', 'DD', 'hh', 'mm', 'ss', 'ms' ];

function getBody( stream ) {
	return new Promise( ( resolve, reject ) => {
		const buff = [];
		
		stream.on( 'error', reject );
		stream.on( 'close', () => {
			reject( new Error( 'connection closed' ) );
		} );
		stream.on( 'data', ( chunk ) => {
			buff.push( chunk );
		} );
		stream.on( 'end', () => {
			resolve( Buffer.concat( buff ) );
		} );
		
	} );
}

function getId() {
	return `${ Date.now() }-${ process.pid }-${ idCounter[ 0 ]++ }`;
}

function formattedDate( date, format ) {
	
	date = {
		YY: date.getFullYear(),
		MM: date.getMonth() + 1,
		DD: date.getDate(),
		hh: date.getHours(),
		mm: date.getMinutes(),
		ss: date.getSeconds(),
		ms: date.getMilliseconds()
	};
	
	dateParts.forEach( ( part ) => {
		format = format.replace( part, date[ part ] );
	} );
	
	return format;
	
}

function requireHooks( ) {
	
	const router = new Map();
	const nativeLoad = Module._load;
	
	Module._load = ( request, parent, isMain )=> {
		
		const file = Module._resolveFilename( request, parent, isMain );
		
		if( router.has( file ) ) {
			
			const type = typeof( router.get( file ) );
			
			switch ( type ) {
				case 'string': {
					if( fs.existsSync( router.get( file ) ) ) {
						return nativeLoad( router.get( file ), parent, isMain );
					}
					else {
						return router.get( file );
					}
				}
				default: {
					return router.get( file );
				}
			}
		}
		else {
			return nativeLoad( request, parent, isMain );
		}
		
	};
	
	return router;
}

module.exports = {
	getId,
	getBody,
	formattedDate,
	requireHooks
};
