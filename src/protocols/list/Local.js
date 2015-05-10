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
    function Local() {
        _super.call(this);
        this._accountList = [];
        this._accountAttempts = [];
        this._userList = [];
        this._userAttempts = [];
        this._IPWhiteList = [];
        this._protocolName = 'local';
    }
    Local.prototype._clearQueue = function () {
        console.log('Clear queue');
        var userFindTime = Date.now() - (this._userFindTime * 1000);
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
        var accountFindTime = Date.now() - (this._accountFindTime * 1000);
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
    };
    Local.prototype._userIsAllowed = function (ip) {
        return _.indexOf(this._IPWhiteList, ip) > -1;
    };
    Local.prototype.allowIP = function (ip) {
        if (_.indexOf(this._IPWhiteList, ip) == -1) {
            this._IPWhiteList.push(ip);
            return true;
        }
        return false;
    };
    Local.prototype.boot = function (protocolConfig, cb) {
    };
    Local.prototype.loginAttempt = function (accountID, userIP, cb) {
        console.log('Trapjs :: Protocol local :: Login attempt');
        this._clearQueue();
        if (this._userIsAllowed(userIP)) {
            cb();
        }
        else {
            if (_.indexOf(this._userList, userIP) == -1) {
                this._userList[userIP] = {
                    banTimestamp: 0,
                    attempts: []
                };
            }
            this._userList[userIP].attempts.push({
                account: accountID,
                date: Date.now()
            });
            this._userAttempts.push(userIP);
            if (_.indexOf(this._accountList, accountID) == -1) {
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
            cb();
        }
    };
    return Local;
})(Core);
module.exports = Local;
//# sourceMappingURL=Local.js.map