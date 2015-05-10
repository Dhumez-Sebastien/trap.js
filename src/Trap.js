///<reference path="./defLoader.d.ts" />
var LogAttempt = require("./LogAttempt");
var Trap = (function () {
    function Trap() {
        this._protocols = [];
        console.log('Loading protocols');
        var fs = require('fs'), path = require('path'), self = this;
        fs.readdir(__dirname + '/protocols/list/', function (err, files) {
            files.filter(function (file) { return file.substr(-3) === '.js'; })
                .forEach(function (file) {
                self._loadProtocol(file);
            });
        });
    }
    Trap.prototype._loadProtocol = function (filename) {
        console.log('Loading protocol : ' + filename);
        var protocol = require(__dirname + '/protocols/list/' + filename), build = new protocol();
        this._protocols[build.getName()] = build;
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
    Trap.prototype.lockAccount = function (accountID, time) {
    };
    Trap.prototype.loginAttempt = function (accountID, userIP, cb) {
        return this;
    };
    Trap.prototype.unbanUser = function (userIP) {
    };
    Trap.prototype.unlockAccount = function (accountID) {
    };
    Trap.prototype.useProtocol = function (protocol, cb) {
        if (protocol.name == 'redis') {
            var RedisProtocol = require("./protocols/list/Redis");
            var protocolUsed = new RedisProtocol().loadProtocol(protocol, cb);
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