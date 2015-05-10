'use strict';

describe('Functional :: Protocols :: Local', function () {
    it('should use *local* Trapjs protocol', function(done) {
        trapjs.useProtocol({name : 'local'}, function() {
            done();
        });
        assert(trapjs.getProtocolName() == 'local', 'error must get local but  : '+trapjs.getProtocolName());
    });

    it('should have *local* protocol selected', function() {
        assert(trapjs.getProtocolName() == 'local', 'error must get local but  : '+trapjs.getProtocolName());
    });
    it('should simple user attempt', function(done) {
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err == void 0, 'error must be undefined : '+err);
            done();
        });
    });
    it('should ban user', function(done) {

        // Loop login for ban
        for (var i = 0; i < 11; i++) {
            trapjs.addAttempt('Seby45', '112.0.0.0');
        }

        // user must be banned
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err != void 0);
            assert(err.code == 'E_USER_BAN');
            assert(typeof err.user.banTime == 'number');
            assert(err.user.banTime > 7150 && err.user.banTime < 7201);
            done();
        });
    });

    it('should unban user manually', function(done) {
        // Unban user
        trapjs.unbanUser('112.0.0.0');

        // Check unban
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err == void 0, 'error must be undefined : '+err);
            done();
        });
    });

    it('should ban user manually', function(done) {
        // Ban user
        trapjs.banUser('112.0.0.0');

        // Check ban
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err != void 0);
            assert(err.code == 'E_USER_BAN');
            assert(typeof err.user.banTime == 'number');
            assert(err.user.banTime > 7150 && err.user.banTime < 7201);
            done();
        });
    });

    it('should ban user manually with more time', function(done) {
        // Add more time
        trapjs.banUser('112.0.0.0', 86400);

        // Check ban
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err != void 0);
            assert(err.code == 'E_USER_BAN');
            assert(typeof err.user.banTime == 'number');
            assert(err.user.banTime > 86300 && err.user.banTime < 86401);
            done();
        });
    });
});