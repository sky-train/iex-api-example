const assert = require( 'assert' );
const { BlImpl } = require( '../bl' );
const testData = require( './test-data/symbols' );

const iexResponse = testData.JHG;

const successResponse = {
	'latestPrice': 22.13,
	'logo': 'https://storage.googleapis.com/iex/api/logos/JHG.png',
	'article': 'http://app.quotemedia.com/quotetools/newsItem.htm?webmasterId=102699&storyId=7777614763842641'
};

const iexClientMock = {
	getBatch( symbol ) {
		return new Promise( ( resolve, reject ) => {
			switch ( symbol ) {
				case "successSymbol": {
					return resolve( JSON.stringify( iexResponse ) );
				}
				case "nullSymbol" : {
					return resolve( 'Unknown symbol' );
				}
				case "errorSymbol" : {
					return reject( new Error() );
				}
			}
		} );
	}
};

describe( 'bl', () => {
	let blImpl = null;
	before( () => {
		blImpl = new BlImpl( { iex: iexClientMock } );
	} );
	it( 'ticker success response', ( done ) => {
		blImpl.ticker( 'successSymbol' )
			.then( ( data ) => {
				assert.deepStrictEqual( data, successResponse );
				done();
			} )
			.catch( done );
	} );
	it( 'ticker "no content" response', ( done ) => {
		blImpl.ticker( 'nullSymbol' )
			.then( ( data ) => {
				assert.deepStrictEqual( data, null );
				done();
			} )
			.catch( done );
	} );
	it( 'ticker error response', ( done ) => {
		blImpl.ticker( 'errorSymbol' )
			.then( ( data ) => {
				done( new Error() );
			} )
			.catch( ()=>{
				done();
			} );
	} );
} );
