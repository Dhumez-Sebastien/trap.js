/// <reference path="./redis.d.ts" />

declare class A {
    constructor(opts ?: any, cb ?: any);
}

declare module 'ioredis' {
    var out: typeof A;
    export = out;
}