///<reference path="./../def/ioredis.d.ts" />
///<reference path="./../def/lodash.d.ts" />
///<reference path="./../def/node.d.ts" />

/**
 * Def
 */
///<reference path="./def/IAccountJailInfo.d.ts" />
///<reference path="./def/IJailConfig.d.ts" />
///<reference path="./def/ILocalProtocolUser.d.ts" />
///<reference path="./def/IRedisProtocolConfig.d.ts" />
///<reference path="./def/IUserJailInfo.d.ts" />

/**
 * Protocols
 */
///<reference path="./protocols/Core.ts" />
///<reference path="./protocols/list/Local.ts" />
///<reference path="./protocols/list/Redis.ts" />

///<reference path="./Trap.ts" />


declare module Trapjs {
    module Protocols {

        interface Core {
            addAttempt(accountID : string, userIP : string) : void;
            allowIP(ip : string) : boolean;
            banUser(ip : string, time ?: number) : void;
            boot(protocolConfig : any, cb : Function) : void;
            configJail(jailConfig : IJailConfig) : void;
            getName() : string;
            lockAccount(accountID : string, time ?: number) : void;
            loginAttempt(accountID : string, userIP : string, cb : (err ?: any) => void) : void;
            unbanUser(ip : string) : void;
            unlockAccount(accountID : string) : void;
        }

        interface Local extends Core {

        }

        interface Redis extends Core {
            boot(redisConfig :IRedisProtocolConfig, cb : Function) : void;
        }
    }
}