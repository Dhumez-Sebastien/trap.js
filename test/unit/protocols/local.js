'use strict';

describe('Unit :: Protocols.Local', function () {

    var Local = require('../../../src/protocols/list/Local.js');

    it('constructor()', function() {

        var local = new Local();

        assert(typeof local == 'object', 'No found protocol.local : '+local);
        assert(typeof local.getName == 'function', 'protocol.local.getName function error : '+local.getName);
    });
});