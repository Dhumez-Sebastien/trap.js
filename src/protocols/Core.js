///<reference path="./../defLoader.d.ts" />
var Core = (function () {
    function Core() {
        this._protocolName = '';
        this._accountFindTime = 3600;
        this._accountLockEnable = true;
        this._accountLockTime = 600;
        this._accountMaxRetry = 15;
        this._userFindTime = 3600;
        this._userBanTime = 7200;
        this._userMaxRetry = 10;
    }
    Core.prototype.allowIP = function (ip) {
    };
    Core.prototype.boot = function (protocolConfig, cb) {
    };
    Core.prototype.getName = function () {
        return this._protocolName;
    };
    Core.prototype.loginAttempt = function (accountID, userIP, cb) {
    };
    return Core;
})();
module.exports = Core;
//# sourceMappingURL=Core.js.map