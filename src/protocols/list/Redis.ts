///<reference path="./../../defLoader.d.ts" />

// TestApp.ts file
import Core = require("./../Core");
import _ = require("lodash");
import ioredis = require("ioredis");

/**
 * Redis
 *
 * @module :: Redis
 * @description	:: Redis protocol.
 */
class Redis extends Core implements Trapjs.Protocols.Redis {

    /**
     * The Redis client
     *
     * @property _redis
     * @type {Trapjs.Protocols.Core[]}
     * @private
     */
    private _redis:any;

    /**
     * Basic constructor
     */
    public constructor() {
        super();

        // Init name of protocol
        this._protocolName = 'redis';
    }

    /**
     * Load protocol for use
     *
     * @method loadProtocol
     */
    public boot(redisConfig : IRedisProtocolConfig, cb : Function) : void {
        // Loading core protocol
        super.boot(redisConfig, cb);

        // Debug
        console.log('Trapjs :: Protocol <'+this._protocolName+'> trying start');

        // Try connect to redis server
        this._redis = new ioredis({
            port: (redisConfig && redisConfig.port) ? redisConfig.port : 6379,          // Redis port
            host: (redisConfig && redisConfig.host) ? redisConfig.host : '127.0.0.1',   // Redis host
            family: (redisConfig && redisConfig.family) ? redisConfig.family : 4,       // 4(IPv4) or 6(IPv6)
            password: (redisConfig && redisConfig.password) ? redisConfig.password : '',
            db: (redisConfig && redisConfig.password) ? redisConfig.password : 0
        });

        // When client is correctly connected
        this._redis.once('connect', function() {
            cb();
        });

        // Show errors
        this._redis.once('error', function(err) {
            console.warn('Redis Protocol error : '+err);
        });
    }
}

// Export Local protocol
export = Redis;