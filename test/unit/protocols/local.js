'use strict';

describe('Unit :: Protocols.Local', function () {

    var Local = require('../../../src/protocols/list/Local.js');
    var local = new Local();

    it('Test methods', function() {
        assert(typeof local == 'object', 'No found protocol.local : '+local);
        assert(typeof local.getName == 'function', 'protocol.local.getName function error : '+local.getName);
        assert(typeof local._accountIsLocked == 'function', 'protocol.local._accountIsLocked function error : '+local._accountIsLocked);
    });
});