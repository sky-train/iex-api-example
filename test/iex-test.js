const url = require( 'url' );
const path = require( 'path' );
const assert = require('assert');
const { requireHooks } = require( '../lib/utils' );
const testData = require( './test-data/symbols' );
// redefinition '../lib/request.js' before require iex-client
const file_request = path.resolve( __dirname, '../lib/request.js' );
const hooks = requireHooks();
hooks.set( file_request, {
	request( options ) {
		return new Promise( ( resolve, reject ) => {
			const objUrl = url.parse( options.path );
			const arrPath = objUrl.pathname.split( '/' );
			const symbol = arrPath[ arrPath.length - 2 ];
			
			let types;
			
			if ( arrPath[ arrPath.length - 1 ] === 'batch' ) {
				types = objUrl.query.split( '=' )[ 1 ].split( ',' );
			} else {
				types = arrPath[ arrPath.length - 1 ];
			}
			
			if ( (symbol in testData) ) {
				if ( !Array.isArray( types ) ) {
					resolve( testData[ symbol ][ types ] );
				} else {
					const batch = {};
					types.forEach( ( type ) => {
						batch[ type ] = testData[ symbol ][ type ];
					} );
					resolve( batch );
				}
			} else {
				resolve( 'Unknown symbol' );
			}
			
		} );
	}
} );

const iex = require( '../lib/iex-client' );

describe( 'iex client', () => {
	it( 'get success', ( done ) => {
		iex.get( 'ADBE', "quote" )
			.then( ( data )=>{
				assert.deepStrictEqual( data, testData.ADBE.quote );
				done()
			})
			.catch( done );
	} );
	it( 'getBatch success', ( done ) => {
		iex.getBatch( 'JHG', [ 'quote', 'news' ] )
			.then( ( data )=>{
				assert.deepStrictEqual( data, { quote: testData.JHG.quote, news:  testData.JHG.news } );
				done()
			})
			.catch( done );
	} );
	it( 'getBatch Unknown symbol', ( done ) => {
		iex.getBatch( 'symbolUnknown', [ 'quote', 'news' ] )
			.then( ( data )=>{
				assert.deepStrictEqual( data, 'Unknown symbol' );
				done()
			})
			.catch( done );
	} );
} );
