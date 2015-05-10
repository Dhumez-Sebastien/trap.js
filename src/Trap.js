///<reference path="./defLoader.d.ts" />
var LogAttempt = require("./LogAttempt");
var Trap = (function () {
    function Trap() {
        this._protocols = [];
        this._ready = false;
        this._waintingCallback = [];
        console.log('Loading protocols');
        var fs = require('fs'), path = require('path'), self = this;
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
        console.log('Loading protocol : ' + filename);
        var protocol = require(__dirname + '/protocols/list/' + filename), build = new protocol();
        this._protocols[build.getName()] = build;
        if (!this._protocolUsed && build.getName() === 'local') {
            this.useProtocol({ name: 'local' });
        }
    };
    Trap.prototype.allowIP = function (userIP) {
    };
    Trap.prototype.banUser = function (userIP, time) {
    };
    Trap.prototype.configJail = function (jailConfiguration) {
        return this;
    };
    Trap.prototype.getAccounts = function () {
        return [];
    };
    Trap.prototype.getBannedUsers = function () {
        return [];
    };
    Trap.prototype.getLockedAccounts = function () {
        return [];
    };
    Trap.prototype.getUsers = function () {
        return [];
    };
    Trap.prototype.injectProtocols = function () {
    };
    Trap.prototype.lockAccount = function (accountID, time) {
    };
    Trap.prototype.loginAttempt = function (accountID, userIP, cb) {
        this._protocolUsed.loginAttempt(accountID, userIP, cb);
        return this;
    };
    Trap.prototype.unbanUser = function (userIP) {
    };
    Trap.prototype.unlockAccount = function (accountID) {
    };
    Trap.prototype.useProtocol = function (protocol, cb) {
        if (this._ready || this._protocols[protocol.name]) {
            if (this._protocols[protocol.name]) {
                this._protocolUsed = this._protocols[protocol.name];
                console.log('Trapjs :: Use protocol : ' + protocol.name);
                this._protocolUsed.boot(protocol, function () {
                    if (cb) {
                        cb();
                    }
                    console.log('Trapjs :: Protocol ' + protocol.name + ' is init with success');
                });
            }
            else {
                console.error('Trapjs :: Protocol no found : ' + protocol.name);
            }
        }
        else {
            var self = this;
            console.log('Trapjs :: Add useProtocol callback in waiting');
            this._waintingCallback.push(function () {
                self.useProtocol(protocol, cb);
            });
        }
        return this;
    };
    Trap.checkAccountAttempt = function (accountLogin) {
        var accLog = accountLogin.toLowerCase();
        if (!this.accLogList[accLog]) {
            this.accLogList[accLog] = new LogAttempt();
        }
        console.log('Account login attempt : ' + accountLogin + " | Number of Attempt : " + this.accLogList[accLog].getAttempt() + " | Account locked : " + this.accLogList[accLog].getLocked());
        return !this.accLogList[accLog].isLocked();
    };
    Trap.checkUserAttempt = function (userIP) {
        if (!this.IPLogList[userIP]) {
            this.IPLogList[userIP] = new LogAttempt();
        }
        console.log('IP try connect attempt | IP : ' + userIP + " | Number of Attempt : " + this.IPLogList[userIP].getAttempt() + " | IP locked : " + this.IPLogList[userIP].getLocked());
        return !this.IPLogList[userIP].isLocked();
    };
    Trap.IPLogList = [];
    return Trap;
})();
module.exports = new Trap();
//# sourceMappingURL=Trap.js.map