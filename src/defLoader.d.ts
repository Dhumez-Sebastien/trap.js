///<reference path="./../def/ioredis.d.ts" />
///<reference path="./../def/lodash.d.ts" />
///<reference path="./../def/node.d.ts" />

/**
 * Def
 */
///<reference path="./def/IAccountJailInfo.d.ts" />
///<reference path="./def/IJailConfig.d.ts" />
///<reference path="./def/ILocalProtocolAccount.d.ts" />
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
            getAccounts(cb : (err : any, res : ILocalProtocolAccountPublic[]) => void) : void;
            getBannedUsers(cb : (err : any, res : IUserJailInfoPublic[]) => void) : void;
            getLockedAccounts(cb : (err : any, res : IAccountJailInfoPublic[]) => void) : void;
            getUsers(cb : (err : any, res : ILocalProtocolUserPublic[]) => void) : void;
            getName() : string;
            lockAccount(accountID : string, time ?: number) : void;
            loginAttempt(accountID : string, userIP : string, cb : (err ?: any) => void) : void;
            unbanUser(ip : string) : void;
            unlockAccount(accountID : string) : void;
        }

        interface Local extends Core {
            //getBannedUsers() : IUserJailInfoPublic[];
        }

        interface Redis extends Core {
            //boot(redisConfig :IRedisProtocolConfig, cb : Function) : void;
        }
    }
}