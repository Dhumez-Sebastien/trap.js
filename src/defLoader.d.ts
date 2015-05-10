///<reference path="./../def/ioredis.d.ts" />
///<reference path="./../def/lodash.d.ts" />
///<reference path="./../def/node.d.ts" />

/**
 * Def
 */
///<reference path="./def/IRedisProtocolConfig.d.ts" />

/**
 * Protocols
 */
///<reference path="./protocols/Core.ts" />
///<reference path="./protocols/list/Local.ts" />
///<reference path="./protocols/list/Redis.ts" />

///<reference path="./LogAttempt.ts" />
///<reference path="./Protocols.ts" />
///<reference path="./Trap.ts" />


declare module Trapjs {
    module Protocols {

        interface Core {
            boot():void;
            getName() : string;
        }

        interface Local extends Core {
            boot():void;
        }

        interface Redis extends Core {
            boot():void;
        }
    }
}