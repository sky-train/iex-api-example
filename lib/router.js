const url = require( 'url' );
const { EventEmitter } = require( 'events' );
const { getId } = require( './utils' );

class RouterPath {
	
	constructor( path, delimiter = '/' ) {
		
		const obj = RouterPath.parse( path, delimiter );
		
		this.key = path;
		this.reg = new RegExp( obj.key, 'i' );
		this.params = obj.params;
		this.handler = null;
		
	}
	
	test( req, pathname ) {
		
		const result = this.reg.exec( pathname );
		
		if ( result && result[ 0 ] === pathname ) {
			
			// set params to req
			req.params = {};
			
			for ( let item = 0; item < this.params.length; item++ ) {
				req.params[ this.params[ item ] ] = result[ item + 1 ];
			}
			
			return this.handler;
		} else {
			return null;
		}
		
	}
	
	static parse( path, delimiter = '/' ) {
		
		let reg = [];
		let params = [];
		// first delimiter
		if ( path[ 0 ] === delimiter ) {
			path = path.substring( 1 );
		}
		// last delimiter
		if ( path[ path.length - 1 ] === delimiter ) {
			path = path.substring( 0, -1 );
		}
		
		path.split( delimiter ).forEach( ( item ) => {
			
			if ( item[ 0 ] === ':' ) {
				reg.push( '([^\/]*)' );
				params.push( item.substring( 1 ) )
			} else {
				reg.push( item );
			}
			
		} );
		
		return { key: `${ delimiter }${ reg.join( delimiter ) }`, params };
		
	}
	
}

function addMethod( router, method ) {
	
	router[ method ] = new Map();
	
	return function ( path, handler ) {
		
		if ( !router[ method ].has( path ) ) {
			router[ method ].set( path, new RouterPath( path ) );
		}
		
		router[ method ].get( path ).handler = handler;
	}
	
}

function factory() {
	
	let ee = new EventEmitter();
	
	const router = function ( req, res ) {
		
		req.id = res.id = getId();
		const pathname = url.parse( req.url ).pathname;
		const method = req.method;
		let handler = null;
		
		if ( method in router ) {
			for ( let rPath of router[ method ].values() ) {
				handler = rPath.test( req, pathname );
				if ( handler ) {
					return handler( req, res );
				}
			}
		}
		
		return ee.emit( "not-resolved-route-path", req, res );
		
	};
	
	router.on = ee.on.bind( ee );
	router.get = addMethod( router, 'GET' );
	router.post = addMethod( router, 'POST' );
	
	return router;
	
}

module.exports = { Router: factory, RouterPath };
