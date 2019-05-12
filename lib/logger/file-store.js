const { appendFile } = require( 'fs' );
const { AbstractLogStore } = require( './store' );

class FileLogStore extends AbstractLogStore {
	constructor( file ) {
		super();
		this.file = file;
	}
	
	send( message ) {
		appendFile( this.file, message, ( err ) => {
			if ( err ) {
				console.log( err );
			}
		} );
	}
}

module.exports = { FileLogStore };
