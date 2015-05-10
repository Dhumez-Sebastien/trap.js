///<reference path="./../../defLoader.d.ts" />

// TestApp.ts file
import Core = require("./../Core");
import _ = require("lodash");
import ioredis = require("ioredis");

class Redis extends Core implements Trapjs.Protocols.Redis {

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
     * Init protocol
     *
     * @method boot
     */
    public boot():void {
        super.boot();
    }

    /**
     * Load protocol for use
     *
     * @method loadProtocol
     */
    public loadProtocol(redisConfig ?:IRedisProtocolConfig, cb ?: () => void):void {
        // Loading core protocol
        super.loadProtocol();

        // Debug
        console.log('Trying start redis protocol');

        var callback = (cb) ? cb : function() {};

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
            callback();
        });

        // Show errors
        this._redis.once('error', function(err) {
            console.warn('Redis Protocol error : '+err);
        });
    }

}

// Export Local protocol
export = Redis;