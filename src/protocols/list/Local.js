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
        this._IPList = [];
        this._IPWhiteList = [];
        this._protocolName = 'local';
    }
    Local.prototype.allowIP = function (ip) {
        if (_.indexOf(this._IPWhiteList, ip) == -1) {
            this._IPWhiteList.push(ip);
            return true;
        }
        return false;
    };
    Local.prototype.boot = function () {
        _super.prototype.boot.call(this);
    };
    Local.prototype.loadProtocol = function () {
    };
    return Local;
})(Core);
module.exports = Local;
//# sourceMappingURL=Local.js.map