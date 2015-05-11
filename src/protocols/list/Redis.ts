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
     *
     * @param jailConfig {IJailConfig}      Jail configuration
     */
    public constructor(jailConfig:IJailConfig) {
        super(jailConfig);

        // Init name of protocol
        this._protocolName = 'redis';
    }

    /**
     * Add a new IP address in white list
     * @method allowIP
     *
     * @param ip {string}       IP address of user allowed
     * @return {boolean}        Return true if IP is added or false is she's already in DB
     */
    public allowIP(ip:string):boolean {
        return false;
    }

    /**
     * Load protocol for use
     *
     * @method loadProtocol
     */
    public boot(redisConfig:IRedisProtocolConfig, cb:Function):void {
        // Debug
        console.log('Trapjs :: Protocol <' + this._protocolName + '> trying start');

        // Try connect to redis server
        this._redis = new ioredis({
            port: (redisConfig && redisConfig.port) ? redisConfig.port : 6379,          // Redis port
            host: (redisConfig && redisConfig.host) ? redisConfig.host : '127.0.0.1',   // Redis host
            family: (redisConfig && redisConfig.family) ? redisConfig.family : 4,       // 4(IPv4) or 6(IPv6)
            password: (redisConfig && redisConfig.password) ? redisConfig.password : '',
            db: (redisConfig && redisConfig.password) ? redisConfig.password : 0
        });

        // When client is correctly connected
        this._redis.once('connect', function () {
            cb();
        });

        // Show errors
        this._redis.once('error', function (err) {
            console.warn('Redis Protocol error : ' + err);
        });
    }

    /**
     * Get the list of users actually
     * @method getAccounts
     *
     * @param cb {Function}                 Callback to get list of users
     */
    public getAccounts(cb : (err : any, res : ILocalProtocolAccountPublic[]) => void) : void {

    }

    /**
     * Get the list of users banned actually
     * @method getBannedUsers
     *
     * @param cb {Function}                 Callback to get list of banned users
     */
    public getBannedUsers(cb:(err:any, res:IUserJailInfoPublic[]) => void) : void {

    }

    /**
     * Get the list of users banned actually
     * @method getBannedUsers
     *
     * @param cb {Function}                 Callback to get list of banned users
     */
    public getLockedAccounts(cb:(err:any, res:IAccountJailInfoPublic[]) => void):void {

    }

    /**
     * Get the list of users actually
     * @method getUsers
     *
     * @param cb {Function}                 Callback to get list of users
     */
    public getUsers(cb:(err:any, res:ILocalProtocolUserPublic[]) => void):void {

    }
}

// Export Local protocol
export = Redis;