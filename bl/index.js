//const logger = require('../lib/logger').logger.get( `blImpl (${ __dirname })`, { levels:['trace']} );
const TICKER_TYPES = [ 'quote', 'logo', 'news' ].join();

function initialize( resources ) {
    
    const { iex } = resources;
    
    function ticker( symbol ) {
        
        return iex.getBatch( symbol, TICKER_TYPES )
            .then( ( data )=> {
                //logger.trace( data.toString() );
                try {
                    data = JSON.parse( data );
                }
                catch( err ) {
                    // no content
                    return null
                }
                
                const logo = data && data.logo && data.logo.url;
                const article = data && data.news && data.news[0] && data.news[0].url;
                const latestPrice = data && data.quote && data.quote.latestPrice;
                
                return { latestPrice, logo,  article };
            } );
    }
    
    return {
        ticker
    };
    
}

module.exports = { BlImpl: initialize };
