///<reference path="./../../defLoader.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Core = require("./../Core");
var _ = require("lodash");
var Local = (function (_super) {
    __extends(Local, _super);
    function Local(jailConfig) {
        _super.call(this, jailConfig);
        this._accountAttempts = [];
        this._accountJail = [];
        this._accountJailInfo = [];
        this._accountList = [];
        this._userAttempts = [];
        this._userJail = [];
        this._userJailInfo = [];
        this._userList = [];
        this._IPWhiteList = [];
        this._protocolName = 'local';
    }
    Local.prototype._accountIsLocked = function (accountID) {
        return _.indexOf(this._accountJail, accountID) != -1;
    };
    Local.prototype._clearQueue = function () {
        var userFindTime = Date.now() - this._userFindTime;
        for (var i = 0, ls = this._userAttempts.length; i < ls; i++) {
            if (this._userList[this._userAttempts[i]].attempts[0].date < userFindTime) {
                this._userList[this._userAttempts[i]].attempts.shift();
                if (this._userList[this._userAttempts[i]].attempts.length == 0) {
                    delete (this._userList[this._userAttempts[i]]);
                }
                this._userAttempts.shift();
                ls--;
                i--;
            }
            else {
                break;
            }
        }
        var accountFindTime = Date.now() - this._accountFindTime;
        for (var i = 0, ls = this._accountAttempts.length; i < ls; i++) {
            if (this._accountList[this._accountAttempts[i]].attempts[0].date < accountFindTime) {
                this._accountList[this._accountAttempts[i]].attempts.shift();
                if (this._accountList[this._accountAttempts[i]].attempts.length == 0) {
                    delete (this._accountList[this._accountAttempts[i]]);
                }
                this._accountAttempts.shift();
                ls--;
                i--;
            }
            else {
                break;
            }
        }
        for (var i = 0, ls = this._userJail.length; i < ls; i++) {
            if (this._userJailInfo[this._userJail[i]].endBan < Date.now()) {
                delete (this._userJailInfo[this._userJail[i]]);
                this._userJail.splice(i, 1);
                i--;
                ls--;
            }
        }
        for (var i = 0, ls = this._accountJail.length; i < ls; i++) {
            if (this._accountJailInfo[this._accountJail[i]].endLock < Date.now()) {
                delete (this._accountJailInfo[this._accountJail[i]]);
                this._accountJail.splice(i, 1);
                i--;
                ls--;
            }
        }
    };
    Local.prototype._userIsAllowed = function (ip) {
        return _.indexOf(this._IPWhiteList, ip) > -1;
    };
    Local.prototype._userIsBanned = function (ip) {
        return _.indexOf(this._userJail, ip) != -1;
    };
    Local.prototype.addAttempt = function (accountID, userIP) {
        _super.prototype.addAttempt.call(this, accountID, userIP);
        if (this._userIsBanned(userIP) || (this._accountLockEnable && this._accountIsLocked(accountID))) {
            return;
        }
        if (!this._userList[userIP]) {
            this._userList[userIP] = {
                attempts: []
            };
        }
        this._userList[userIP].attempts.push({
            accountID: accountID,
            date: Date.now()
        });
        this._userAttempts.push(userIP);
        if (this._userList[userIP].attempts.length >= this._userMaxRetry) {
            this._userJail.push(userIP);
            this._userJailInfo[userIP] = {
                attempts: this._userList[userIP].attempts,
                endBan: Date.now() + this._userBanTime
            };
        }
        if (this._accountLockEnable) {
            if (!this._accountList[accountID]) {
                this._accountList[accountID] = {
                    lockTimestamp: 0,
                    attempts: []
                };
            }
            this._accountList[accountID].attempts.push({
                ip: userIP,
                date: Date.now()
            });
            this._accountAttempts.push(accountID);
            if (this._accountList[accountID].attempts.length >= this._accountMaxRetry) {
                this._accountJail.push(accountID);
                this._accountJailInfo[accountID] = {
                    attempts: this._accountList[accountID].attempts,
                    endLock: Date.now() + this._accountLockTime
                };
            }
        }
    };
    Local.prototype.allowIP = function (ip) {
        if (_.indexOf(this._IPWhiteList, ip) == -1) {
            this._IPWhiteList.push(ip);
            return true;
        }
        return false;
    };
    Local.prototype.banUser = function (ip, time) {
        var customTime = (time) ? time * 1000 : this._userBanTime;
        if (this._userIsBanned(ip)) {
            this._userJailInfo[ip].endBan = Date.now() + customTime;
        }
        else {
            this._userJail.push(ip);
            this._userJailInfo[ip] = {
                attempts: [],
                endBan: Date.now() + customTime
            };
        }
    };
    Local.prototype.getAccounts = function (cb) {
        var out = [];
        for (var i = 0, ls = this._accountAttempts.length; i < ls; i++) {
            var info = this._accountList[this._accountAttempts[i]];
            info.accountID = this._accountAttempts[i];
            if (this._accountIsLocked(this._accountAttempts[i])) {
                info.endLock = this._accountJailInfo[this._accountAttempts[i]].endLock;
            }
            out.push(info);
        }
        cb(null, out);
    };
    Local.prototype.getBannedUsers = function (cb) {
        var out = [];
        for (var i = 0, ls = this._userJail.length; i < ls; i++) {
            var info = this._userJailInfo[this._userJail[i]];
            info.ip = this._userJail[i];
            out.push(info);
        }
        cb(null, out);
    };
    Local.prototype.getLockedAccounts = function (cb) {
        var out = [];
        for (var i = 0, ls = this._accountJail.length; i < ls; i++) {
            var info = this._accountJailInfo[this._accountJail[i]];
            info.accountID = this._accountJail[i];
            out.push(info);
        }
        cb(null, out);
    };
    Local.prototype.getUsers = function (cb) {
        var out = [];
        for (var i = 0, ls = this._userAttempts.length; i < ls; i++) {
            var info = this._userList[this._userAttempts[i]];
            info.ip = this._userAttempts[i];
            if (this._userIsBanned(this._userAttempts[i])) {
                info.endBan = this._userJailInfo[this._userAttempts[i]].endBan;
            }
            out.push(info);
        }
        cb(null, out);
    };
    Local.prototype.lockAccount = function (accountID, time) {
        if (!this._accountLockEnable) {
            console.log('Trapjs :: You try lock manually account but system is currently off (jailConfig.accountLockEnable = false)');
            return;
        }
        var customTime = (time) ? (time * 1000) : this._accountLockTime;
        if (this._accountIsLocked(accountID)) {
            this._accountJailInfo[accountID].endLock = Date.now() + customTime;
        }
        else {
            this._accountJail.push(accountID);
            this._accountJailInfo[accountID] = {
                attempts: [],
                endLock: Date.now() + customTime
            };
        }
    };
    Local.prototype.loginAttempt = function (accountID, userIP, cb) {
        // Debug
        //console.log('Trapjs :: Protocol local :: Login attempt');
        this._clearQueue();
        if (this._userIsAllowed(userIP)) {
            cb();
        }
        else if (this._userIsBanned(userIP)) {
            cb({
                code: 'E_USER_BAN',
                user: {
                    banTime: (this._userJailInfo[userIP].endBan - Date.now()) / 1000
                }
            });
        }
        else if (this._accountLockEnable && this._accountIsLocked(accountID)) {
            cb({
                code: 'E_ACCOUNT_LOCK',
                account: {
                    lockTime: (this._accountJailInfo[accountID].endLock - Date.now()) / 1000
                }
            });
        }
        else {
            cb();
        }
    };
    Local.prototype.unbanUser = function (ip) {
        var userIndex = _.indexOf(this._userJail, ip);
        if (userIndex != -1) {
            delete (this._userJailInfo[ip]);
            this._userJail.splice(userIndex, 1);
            if (this._userList[ip]) {
                while (this._userList[ip].attempts.length > 0) {
                    this._userList[ip].attempts.pop();
                }
                delete (this._userList[ip]);
            }
            while (_.indexOf(this._userAttempts, ip) != -1) {
                var index = (_.indexOf(this._userAttempts, ip));
                this._userAttempts.splice(index, 1);
            }
        }
    };
    Local.prototype.unlockAccount = function (accountID) {
        if (!this._accountLockEnable) {
            return;
        }
        var accountIndex = _.indexOf(this._accountJail, accountID);
        if (accountIndex != -1) {
            delete (this._accountJailInfo[accountID]);
            this._accountJail.splice(accountIndex, 1);
            if (this._accountList[accountID]) {
                while (this._accountList[accountID].attempts.length > 0) {
                    this._accountList[accountID].attempts.pop();
                }
                delete (this._accountList[accountID]);
            }
            while (_.indexOf(this._accountAttempts, accountID) != -1) {
                var index = (_.indexOf(this._accountAttempts, accountID));
                this._accountAttempts.splice(index, 1);
            }
        }
    };
    return Local;
})(Core);
module.exports = Local;
//# sourceMappingURL=Local.js.map