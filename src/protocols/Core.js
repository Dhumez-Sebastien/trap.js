///<reference path="./../defLoader.d.ts" />
var Core = (function () {
    function Core() {
        this._protocolName = '';
    }
    Core.prototype.allowIP = function (ip) {
    };
    Core.prototype.boot = function () {
    };
    Core.prototype.getName = function () {
        return this._protocolName;
    };
    Core.prototype.loadProtocol = function () {
    };
    return Core;
})();
module.exports = Core;
//# sourceMappingURL=Core.js.map