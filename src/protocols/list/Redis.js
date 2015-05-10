///<reference path="./../../defLoader.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Core = require("./../Core");
var ioredis = require("ioredis");
var Redis = (function (_super) {
    __extends(Redis, _super);
    function Redis(jailConfig) {
        _super.call(this, jailConfig);
        this._protocolName = 'redis';
    }
    Redis.prototype.allowIP = function (ip) {
        return false;
    };
    Redis.prototype.boot = function (redisConfig, cb) {
        console.log('Trapjs :: Protocol <' + this._protocolName + '> trying start');
        this._redis = new ioredis({
            port: (redisConfig && redisConfig.port) ? redisConfig.port : 6379,
            host: (redisConfig && redisConfig.host) ? redisConfig.host : '127.0.0.1',
            family: (redisConfig && redisConfig.family) ? redisConfig.family : 4,
            password: (redisConfig && redisConfig.password) ? redisConfig.password : '',
            db: (redisConfig && redisConfig.password) ? redisConfig.password : 0
        });
        this._redis.once('connect', function () {
            cb();
        });
        this._redis.once('error', function (err) {
            console.warn('Redis Protocol error : ' + err);
        });
    };
    return Redis;
})(Core);
module.exports = Redis;
//# sourceMappingURL=Redis.js.map