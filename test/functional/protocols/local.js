'use strict';

describe('Functional :: Protocols :: Local', function () {
    it('should use *local* Trapjs protocol', function(done) {
        trapjs.useProtocol({protocol : 'local'}, function() {
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

            // Unban user
            trapjs.unbanUser('112.0.0.0');

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

            // Unban user
            trapjs.unbanUser('112.0.0.0');

            done();
        });
    });

    it('should lock account', function(done) {
        // We try connect on account 10 times, now if we try 6x time, account must be locked (15 connect tentative by default on account)

        // Loop login for ban
        for (var i = 0; i < 6; i++) {
            trapjs.addAttempt('Seby45', '112.0.0.0');
        }

        // Account must be locked
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err != void 0);
            assert(err.code == 'E_ACCOUNT_LOCK');
            assert(typeof err.account.lockTime == 'number');
            assert(err.account.lockTime > 550 && err.account.lockTime < 601);
            done();
        });
    });

    it('should unlock account manually', function(done) {
        // Unlock account
        trapjs.unlockAccount('Seby45');

        // Account must be locked
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err == void 0);
            done();
        });
    });

    it('should lock account manually', function(done) {
        // Ban user
        trapjs.lockAccount('Seby45');

        // Check ban
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err != void 0);
            assert(err.code == 'E_ACCOUNT_LOCK');
            assert(typeof err.account.lockTime == 'number');
            assert(err.account.lockTime > 550 && err.account.lockTime < 601);

            // Unlock account
            trapjs.unlockAccount('Seby45');

            done();
        });
    });

    it('should lock account manually with more time', function(done) {
        // Add more time
        trapjs.lockAccount('Seby45', 86400);

        // Check ban
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err != void 0);
            assert(err.code == 'E_ACCOUNT_LOCK');
            assert(typeof err.account.lockTime == 'number');
            assert(err.account.lockTime > 86300 && err.account.lockTime < 86401);

            // Unlock account
            trapjs.unlockAccount('Seby45');

            done();
        });
    });
});