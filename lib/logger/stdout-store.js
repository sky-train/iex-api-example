const { AbstractLogStore } = require('./store');

class StdOutLogStore extends AbstractLogStore {
	constructor( ) {
		super();
	}
	send( message ) {
		console.log( message );
	}
}

module.exports = {
	StdOutLogStore
};
