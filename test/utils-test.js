const assert = require( 'assert' );
const { formattedDate } = require( '../lib/utils' );
describe( 'utils', () => {
	it( 'formattedDate', () => {
		const strDate = formattedDate( new Date( 2019, 4, 12, 7, 31, 13 ), 'MM/DD/YY hh:mm:ss' );
		assert.strictEqual( '5/12/2019 7:31:13', strDate );
	} );
} );
