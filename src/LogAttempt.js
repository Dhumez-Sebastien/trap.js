///<reference path="./defLoader.d.ts" />
var LogAttempt = (function () {
    function LogAttempt() {
        this.lastAttempt = Date.now();
        this.locked = false;
        this.loginAttempt = 0;
    }
    LogAttempt.prototype.addAttempt = function () {
        if (this.lastAttempt > Date.now() - 10000) {
            this.loginAttempt++;
        }
        this.lastAttempt = Date.now();
        if (this.loginAttempt > 5) {
            this.locked = true;
            return true;
        }
        return false;
    };
    LogAttempt.prototype.getAttempt = function () {
        return this.loginAttempt;
    };
    LogAttempt.prototype.getLocked = function () {
        return this.locked;
    };
    LogAttempt.prototype.isLocked = function () {
        if (this.locked) {
            if (this.lastAttempt < (Date.now() - (1000 * 60 * 5))) {
                this.locked = false;
                this.loginAttempt = 0;
                this.addAttempt();
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return this.addAttempt();
        }
    };
    return LogAttempt;
})();
module.exports = LogAttempt;
//# sourceMappingURL=LogAttempt.js.map