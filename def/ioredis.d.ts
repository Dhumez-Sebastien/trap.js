/// <reference path="./redis.d.ts" />

declare class A {
    state: string;
    constructor(opts ?: any, cb ?: any);
    update(): void;
}

declare module 'ioredis' {
    var out: typeof A;
    export = out;
}