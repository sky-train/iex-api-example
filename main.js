const { join } = require( 'path' );
const { tmpdir } = require( 'os' );

const iex = require( './lib/iex-client' );
const config = require( './config.json' );

const { FileLogStore, logger } = require( './lib/logger' );

const log = logger.get(
	`request-logger`,
	{
		store: new FileLogStore( join( config.log.dir || tmpdir(), config.log.name ) ),
		dateFormat: config.log.dateFormat,
		levels: 'all'
	}
);

const { Server } = require( './lib/server' );
const { Router } = require( './lib/router' );
const { BlImpl } = require( './bl' );

const router = new Router();
const server = new Server( router );
const blImpl = new BlImpl( { iex } );

router.get( '/ticker/:symbol', ( req, res ) => {
	
	blImpl.ticker( req.params.symbol )
		.then( ( data ) => {
			res.statusCode = data ? 200 : 204;
			res.setHeader( 'Content-Type', 'application/json' );
			res.end( JSON.stringify( data ) );
			log.info( req.url, 'send data in response:', !!data ? 'yes' : 'no' );
		} )
		.catch( ( err ) => {
			log.error( req.url, err );
			res.statusCode = 500;
			res.end();
		} );
} );

router.on( 'not-resolved-route-path', ( req, res ) => {
	res.statusCode = 400;
	res.end();
	log.warn( req.url, 'not-resolved-route-path' );
} );

server.on( 'error', ( err ) => {
	log.error( err );
} );

server.listen( config.http.port );
