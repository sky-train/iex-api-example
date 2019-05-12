const url = require( 'url' );
const configApi = require( './config-api.json' );
const { request } = require( '../request' );

// prepare api
Object.keys( configApi.path ).forEach( ( name ) => {
	const options = url.parse( configApi.host );
	options.timeout = configApi.timeout;
	options.method = 'GET';
	configApi.path[ name ] = { template: configApi.path[ name ], options };
} );

// prepare batch
configApi.batch.options = url.parse( configApi.host );
configApi.batch.options.timeout = configApi.timeout;
configApi.batch.options.method = 'GET';

const client = {
	get( symbol, type ) {
		const options = configApi.path[ type ].options;
		options.path = configApi.path[ type ].template.replace( ':symbol', symbol );
		return request( options );
	},
	getBatch( symbol, types ) {
		const options = configApi.batch.options;
		options.path = configApi.batch.template.replace( ':symbol', symbol );
		options.path = options.path.replace( ':types', types );
		return request( options );
	}
};

module.exports = client;
