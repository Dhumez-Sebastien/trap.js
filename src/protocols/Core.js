///<reference path="./../defLoader.d.ts" />
var Core = (function () {
    function Core(jailConfig) {
        this._protocolName = '';
        this._accountLockEnable = true;
        if (jailConfig) {
            this._accountFindTime = (jailConfig.accountFindTime) ? jailConfig.accountFindTime : 3600 * 1000;
            this._accountLockEnable = (jailConfig.accountLockEnable == true);
            this._accountLockTime = (jailConfig.accountLockTime) ? jailConfig.accountLockTime : 600 * 1000;
            this._accountMaxRetry = (jailConfig.accountMaxRetry) ? jailConfig.accountMaxRetry : 15;
            this._userFindTime = (jailConfig.userFindTime) ? jailConfig.userFindTime : 3600 * 1000;
            this._userBanTime = (jailConfig.userBanTime) ? jailConfig.userBanTime : 7200 * 1000;
            this._userMaxRetry = (jailConfig.userMaxRetry) ? jailConfig.userMaxRetry : 10;
        }
    }
    Core.prototype.addAttempt = function (accountID, userIP) {
    };
    Core.prototype.allowIP = function (ip) {
    };
    Core.prototype.banUser = function (ip, time) {
    };
    Core.prototype.boot = function (protocolConfig, cb) {
        cb();
    };
    Core.prototype.configJail = function (jailConfig) {
        if (jailConfig) {
            if (jailConfig.accountFindTime) {
                this._accountFindTime = jailConfig.accountFindTime * 1000;
            }
            if (jailConfig.accountLockEnable != void 0) {
                this._accountLockEnable = !!jailConfig.accountLockEnable;
            }
            if (jailConfig.accountLockTime) {
                this._accountLockTime = jailConfig.accountLockTime * 1000;
            }
            if (jailConfig.accountMaxRetry) {
                this._accountMaxRetry = jailConfig.accountMaxRetry;
            }
            if (jailConfig.userFindTime) {
                this._userFindTime = jailConfig.userFindTime * 1000;
            }
            if (jailConfig.userBanTime) {
                this._userBanTime = jailConfig.userBanTime * 1000;
            }
            if (jailConfig.userMaxRetry) {
                this._userMaxRetry = jailConfig.userMaxRetry;
            }
        }
    };
    Core.prototype.getName = function () {
        return this._protocolName;
    };
    Core.prototype.lockAccount = function (accountID, time) {
    };
    Core.prototype.loginAttempt = function (accountID, userIP, cb) {
    };
    Core.prototype.unbanUser = function (userIP) {
    };
    Core.prototype.unlockAccount = function (accountID) {
    };
    return Core;
})();
module.exports = Core;
//# sourceMappingURL=Core.js.map