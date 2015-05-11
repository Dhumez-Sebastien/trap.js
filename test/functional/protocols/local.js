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

    it('should get none users', function(done) {
        trapjs.getUsers(function(err, res) {
            assert(err == null, 'error must be null : '+err);
            assert(res.length == 0, 'array must be empty : '+res.length);
            done();
        });
    });

    it('should get none accounts', function(done) {
        trapjs.getAccounts(function(err, res) {
            assert(err == null, 'error must be null : '+err);
            assert(res.length == 0, 'array must be empty : '+res.length);
            done();
        });
    });

    it('should simple user login attempt', function(done) {
        trapjs.loginAttempt('Seby45', '112.0.0.0', function(err) {
            assert(err == void 0, 'error must be undefined : '+err);
            done();
        });
    });

    it('should get first users', function(done) {
        // Add an attempt to store User/IP in local
        trapjs.addAttempt('Seby45', '112.0.0.0');

        trapjs.getUsers(function(err, res) {
            assert(err == null, 'error must be null : '+err);
            assert(res.length == 1, 'array must be 1 : '+res.length);
            assert(res[0].attempts[0].accountID == 'Seby45', 'attempt accountID must be Seby45: '+res[0].attempts[0].accountID);
            assert(typeof res[0].attempts[0].date == 'number', 'date is not number : '+typeof res[0].attempts[0].date);
            assert(res[0].ip == '112.0.0.0', 'ip must be 112.0.0.0: '+res[0].ip);
            assert(res[0].endBan == void 0, 'endBan must be undefined : '+res[0].endBan);
            done();
        });
    });

    it('should get first account', function(done) {
        // Attempt is added in previous test
        trapjs.getAccounts(function(err, res) {
            assert(err == null, 'error must be null : '+err);
            assert(res.length == 1, 'array must be 1 : '+res.length);
            assert(res[0].attempts[0].ip == '112.0.0.0', 'attempt ip must be 112.0.0.0: '+res[0].attempts[0].ip );
            assert(res[0].accountID == 'Seby45', 'ip must be 112.0.0.0: '+res[0].accountID);
            assert(res[0].endLock == void 0, 'endLock must be undefined : '+res[0].endLock);
            done();
        });
    });


    it('should ban user', function(done) {
        // Loop login for ban
        for (var i = 0; i < 10; i++) {
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

    it('should get list of banned users', function(done) {
        // Ban 2 users
        trapjs.banUser('100.0.0.0');
        trapjs.banUser('100.0.0.1');

        // Check list
        trapjs.getBannedUsers(function(err, res) {
            assert(err == null);
            assert(res.length == 2, res.length);
            assert(res[0].ip == '100.0.0.0');
            assert(res[1].ip == '100.0.0.1');
            assert(res[0].attempts.length == 0);
            assert(res[1].attempts.length == 0);
            assert(typeof res[0].endBan == 'number');
            assert(typeof res[1].endBan == 'number');

            // Unban users
            trapjs.unbanUser(['100.0.0.0', '100.0.0.1']);

            done();
        });
    });

    it('should get list of locked accounts', function(done) {
        // Lock 2 accounts
        trapjs.lockAccount('Seby45', 300);
        trapjs.lockAccount('Seby46', 300);

        // Check list
        trapjs.getLockedAccounts(function(err, res) {
            assert(err == null);
            assert(res.length == 2, res.length);
            assert(res[0].accountID == 'Seby45');
            assert(res[1].accountID == 'Seby46');
            assert(res[0].attempts.length == 0);
            assert(res[1].attempts.length == 0);
            assert(typeof res[0].endLock == 'number');
            assert(typeof res[1].endLock == 'number');
            assert(res[0].endLock <= Date.now() + (300 * 1000));
            assert(res[0].endLock >  Date.now() + (250 * 1000));
            assert(res[1].endLock <=  Date.now() + (300 * 1000));
            assert(res[1].endLock >  Date.now() + (250 * 1000));

            // Unlock accounts
            trapjs.unlockAccount(['Seby45', 'Seby46']);

            done();
        });
    });
});