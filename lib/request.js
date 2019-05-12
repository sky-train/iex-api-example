const http = require( 'http' );
const https = require( 'https' );

const { getBody } = require( './utils' );

function request( options, body ) {
	return new Promise( ( resolve, reject ) => {
		
		const _module = options.protocol === 'http:' ? http : https;
		const req = _module.request( options );
		
		req.on( 'error', reject );
		req.on( 'close', () => {
			reject( new Error( 'connection closed' ) );
		} );
		
		req.on( 'response', ( res ) => {
			getBody( res ).then( resolve ).catch( reject );
		} );
		
		if ( options.method === 'POST' && body ) {
			req.write( body );
		}
		
		req.end();
		
	} );
}

module.exports = { request };
