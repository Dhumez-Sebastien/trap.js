describe('Unit :: Trapjs', function () {
    it('should return a function with Trapjs methods', function() {
        assert(typeof trapjs == 'object', 'No found trajps');
        assert(typeof trapjs.useProtocol == 'function', 'useProtocol function error : '+trapjs.useProtocol);
        assert(typeof trapjs.loginAttempt == 'function', 'loginAttempt function error : '+trapjs.loginAttempt);
        assert(typeof trapjs.configJail == 'function', 'configJail function error : '+trapjs.configJail);
        assert(typeof trapjs.unbanUser == 'function', 'unbanUser function error : '+trapjs.unbanUser);
        assert(typeof trapjs.banUser == 'function', 'banUser function error : '+trapjs.banUser);
        assert(typeof trapjs.unlockAccount == 'function', 'unlockAccount function error : '+trapjs.unlockAccount);
        assert(typeof trapjs.lockAccount == 'function', 'lockAccount function error : '+trapjs.lockAccount);
        assert(typeof trapjs.allowIP == 'function', 'allowIP function error : '+trapjs.allowIP);
        assert(typeof trapjs.getBannedUsers == 'function', 'getBannedUsers function error : '+trapjs.getBannedUsers);
        assert(typeof trapjs.getUsers == 'function', 'getUsers function error : '+trapjs.getUsers);
        assert(typeof trapjs.getLockedAccounts == 'function', 'getLockedAccounts function error : '+trapjs.getLockedAccounts);
        assert(typeof trapjs.getAccounts == 'function', 'getAccounts function error : '+trapjs.getAccounts);
    });
});