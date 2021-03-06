///<reference path="./defLoader.d.ts" />
var fs = require('fs');
var _ = require('lodash');
var Trap = (function () {
    function Trap() {
        this._jailConfiguration = {
            accountLockEnable: true,
            accountFindTime: 3600 * 1000,
            accountLockTime: 600 * 1000,
            accountMaxRetry: 15,
            userFindTime: 3600 * 1000,
            userBanTime: 7200 * 1000,
            userMaxRetry: 10
        };
        this._protocols = [];
        this._ready = false;
        this._waintingCallback = [];
        var self = this;
        fs.readdir(__dirname + '/protocols/list/', function (err, files) {
            var protocolCount = files.filter(function (file) { return file.substr(-3) === '.js'; }).length;
            files.filter(function (file) { return file.substr(-3) === '.js'; })
                .forEach(function (file) {
                self._loadProtocol(file);
                if (--protocolCount === 0) {
                    self._ready = true;
                    self._launchWaitingCallback();
                }
            });
        });
    }
    Trap.prototype._launchWaitingCallback = function () {
        while (this._waintingCallback.length > 0) {
            this._waintingCallback[this._waintingCallback.length - 1]();
            this._waintingCallback.pop();
        }
    };
    Trap.prototype._loadProtocol = function (filename) {
        //console.log('Trapjs :: Loading protocol : '+filename);
        var Protocol = require(__dirname + '/protocols/list/' + filename), build = new Protocol(this._jailConfiguration);
        this._protocols[build.getName()] = build;
        if (!this._protocolUsed && build.getName() === 'local') {
            this.useProtocol({ protocol: 'local' });
        }
    };
    Trap.prototype.addAttempt = function (accountID, userIP) {
        this._protocolUsed.addAttempt(accountID, userIP);
        return this;
    };
    Trap.prototype.allowIP = function (ip) {
        if (_.isArray(ip)) {
            var back = false;
            for (var i = 0, ls = ip.length; i < ls; i++) {
                if (this._protocolUsed.allowIP(ip[i])) {
                    back = true;
                }
            }
            return back;
        }
        else {
            return this._protocolUsed.allowIP(ip);
        }
    };
    Trap.prototype.banUser = function (ip, time) {
        this._protocolUsed.banUser(ip, time);
        return this;
    };
    Trap.prototype.configJail = function (jailConfiguration) {
        this._protocolUsed.configJail(jailConfiguration);
        return this;
    };
    Trap.prototype.getAccounts = function (cb) {
        this._protocolUsed.getAccounts(cb);
        return this;
    };
    Trap.prototype.getBannedUsers = function (cb) {
        this._protocolUsed.getBannedUsers(cb);
        return this;
    };
    Trap.prototype.getLockedAccounts = function (cb) {
        this._protocolUsed.getLockedAccounts(cb);
        return this;
    };
    Trap.prototype.getProtocolName = function () {
        return this._protocolUsed.getName();
    };
    Trap.prototype.getUsers = function (cb) {
        this._protocolUsed.getUsers(cb);
        return this;
    };
    Trap.prototype.injectProtocols = function () {
    };
    Trap.prototype.lockAccount = function (accountID, time) {
        this._protocolUsed.lockAccount(accountID, time);
        return this;
    };
    Trap.prototype.loginAttempt = function (accountID, ip, cb) {
        this._protocolUsed.loginAttempt(accountID, ip, cb);
        return this;
    };
    Trap.prototype.unbanUser = function (ip) {
        if (_.isArray(ip)) {
            for (var i = 0, ls = ip.length; i < ls; i++) {
                this.unbanUser(ip[i]);
            }
        }
        else {
            this._protocolUsed.unbanUser(ip);
        }
        return this;
    };
    Trap.prototype.unlockAccount = function (accountID) {
        if (_.isArray(accountID)) {
            for (var i = 0, ls = accountID.length; i < ls; i++) {
                this.unlockAccount(accountID[i]);
            }
        }
        else {
            this._protocolUsed.unlockAccount(accountID);
        }
        return this;
    };
    Trap.prototype.useProtocol = function (protocol, cb) {
        if (this._ready || this._protocols[protocol.protocol]) {
            if (this._protocols[protocol.protocol]) {
                this._protocolUsed = this._protocols[protocol.protocol];
                this._protocolUsed.boot(protocol, function () {
                    if (cb) {
                        cb();
                    }
                });
            }
            else {
                console.error('Trapjs :: Protocol no found : ' + protocol.protocol);
            }
        }
        else {
            var self = this;
            this._waintingCallback.push(function () {
                self.useProtocol(protocol, cb);
            });
        }
        return this;
    };
    return Trap;
})();
module.exports = new Trap();
//# sourceMappingURL=Trap.js.map