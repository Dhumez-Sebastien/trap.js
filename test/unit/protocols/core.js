'use strict';

describe('Unit :: Protocols.Core', function () {

    var Core = require('../../../src/protocols/Core.js');

    it('constructor()', function() {

        var core = new Core();

        assert(typeof core == 'object', 'No found core : '+core);
        assert(typeof core.getName == 'function', 'Core.getName function error : '+core.getName);
    });
});