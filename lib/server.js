const http = require( 'http' );

function httpServerFactory( router ) {
	return http.createServer( router );
}

module.exports = { Server: httpServerFactory };
