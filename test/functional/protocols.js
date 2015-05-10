'use strict';

describe('Functional :: Protocols', function () {
    it('should use Trapjs protocols', function(done) {

        //assert(trapjs.useProtocol({name : 'redis'}) == 'object', 'useProtocol function error : '+trapjs.useProtocol({name : 'redis'}));


        trapjs.useProtocol({name : 'redis', port : 6379}, function() {
            done();
        });
    });
});