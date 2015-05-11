///<reference path="./defLoader.d.ts" />

import Redis = require("./protocols/list/Redis");
import fs = require('fs');
import path = require('path');
import _ = require('lodash');

/**
 * Trap
 *
 * @module :: Trap
 * @description	:: The main file of Trapjs.
 */
class Trap {

    /**
     * Contains configuration of jails
     *
     * @property _jailConfiguration
     * @type {IJailConfig}
     * @private
     */
    private _jailConfiguration : IJailConfig = {
        accountLockEnable : true,
        accountFindTime : 3600 * 1000,
        accountLockTime : 600 * 1000,
        accountMaxRetry : 15,
        userFindTime : 3600 * 1000,
        userBanTime : 7200 * 1000,
        userMaxRetry : 10
    };

    /**
     * Contains the list of protocols availables as object :: _protocols.redis ; _protocols.local
     *
     * @property _protocols
     * @type {Trapjs.Protocols.Core[]}
     * @private
     */
    private _protocols : Trapjs.Protocols.Core[] = [];

    /**
     * The protocol used actually
     *
     * @property _protocolUsed
     * @type {Trapjs.Protocols.Core}
     * @private
     */
    private _protocolUsed : Trapjs.Protocols.Core;

    /**
     * Check if Trapjs is ready for use.
     *
     * @property _ready
     * @type {boolean}
     * @private
     */
    private _ready : boolean = false;

    /**
     * List of callback during Trap init
     *
     * @property _waintingCallback
     * @type {Function[]}
     * @private
     */
    private _waintingCallback : Function[] = [];

    /**
     * Basic constructor
     */
    constructor() {
        //Scope
        var self : Trap = this;

        // Extract the list of protocols availables
        fs.readdir(__dirname+'/protocols/list/', function(err, files) {
            // Count the number of protocols must be loaded
            var protocolCount : number = files.filter(function(file) { return file.substr(-3) === '.js'; }).length;

            // Filter protocols to use only *.js
            files.filter(function(file) { return file.substr(-3) === '.js'; })
                .forEach(function(file) {
                    self._loadProtocol(file);

                    // Check if all protocols are loaded
                    if (--protocolCount === 0) {
                        self._ready = true;
                        self._launchWaitingCallback();
                    }
                });
        });
    }

    /**
     * Launch all callbacks in waiting during Trapjs initialisation
     * @method _launchWaitingCallback
     * @private
     */
    private _launchWaitingCallback() : void {
        while (this._waintingCallback.length > 0) {
            this._waintingCallback[this._waintingCallback.length -1]();
            this._waintingCallback.pop();
        }
    }

    /**
     * Load protocol into Trapjs
     * @method _loadProtocol
     * @private
     *
     * @param filename {string}         Filename of protocol
     */
    private _loadProtocol(filename : string) : void {
        //console.log('Trapjs :: Loading protocol : '+filename);

        // Load protocol from files
        var protocol = require(__dirname+'/protocols/list/'+filename),
            build = new protocol(this._jailConfiguration);

        // Add protocol in list
        this._protocols[build.getName()] = build;

        // Select local protocol by default
        if (!this._protocolUsed && build.getName() === 'local') {
            this.useProtocol({protocol : 'local'});
        }
    }

    /**
     * Add a new connection attempt
     * @method addAttempt
     *
     * @param accountID {string}    Account ID for auth
     * @param userIP {string}       User IP for auth
     */
    public addAttempt(accountID : string, userIP : string) : Trap {
        this._protocolUsed.addAttempt(accountID, userIP);
        return this;
    }

    /**
     * Add a new IP address or a list of IP address in white list
     * @method allowIP
     *
     * @param ip {string}       IP address of user allowed
     * @return {boolean}        Return true if an IP address is added or false if no one is added
     */
    public allowIP(ip : string|string[]|any) : boolean {
        if (_.isArray(ip)) {
            var back : boolean = false;
            for (var i : number = 0, ls : number = ip.length; i < ls; i++) {
                if (this._protocolUsed.allowIP(ip[i])) {
                    back = true;
                }
            }
            return back;
        } else {
            return this._protocolUsed.allowIP(ip);
        }
    }

    /**
     * Ban user manually
     * @method banUser
     *
     * @param ip {string}       IP address of user
     * @param time {number}     Optional ban time in seconds
     */
    public banUser(ip : string, time ?: number) : Trap {
        this._protocolUsed.banUser(ip, time);
        return this;
    }

    /**
     * Update configuration of Jails
     * @method configJail
     *
     * @param jailConfiguration {IJailConfig}   New jail configuration
     */
    public configJail(jailConfiguration : IJailConfig) : Trap {
        this._protocolUsed.configJail(jailConfiguration);
        return this;
    }

    /**
     * Get the list of accounts actually in db
     * @method getAccounts
     *
     * @param cb {Function}         Callback to get list of users
     * @return {Trap}               Return Trapjs instance
     */
    public getAccounts(cb : (err : any, res : ILocalProtocolAccountPublic[]) => void) : Trap {
        this._protocolUsed.getAccounts(cb);
        return this;
    }

    /**
     * Get the list of users actually banned
     * @method getBannedUsers
     *
     * @param cb {Function}                 Callback to get list of banned users
     * @return {Trap}               Return Trapjs instance
     */
    public getBannedUsers(cb : (err : any, res : IUserJailInfoPublic[]) => void) : Trap {
        this._protocolUsed.getBannedUsers(cb);
        return this;
    }

    /**
     * Get the list of accounts actually locked
     * @method getLockedAccounts
     *
     * @param cb {Function}                 Callback to get list of banned users
     * @return {Trap}               Return Trapjs instance
     */
    public getLockedAccounts(cb : (err : any, res : IAccountJailInfoPublic[]) => void) : Trap {
        this._protocolUsed.getLockedAccounts(cb);
        return this;
    }

    /**
     * Get the name of protocol used actually
     * @method getProtocolName
     *
     * @return string       The name of protocol
     */
    public getProtocolName() : string {
        return this._protocolUsed.getName();
    }

    /**
     * Get the list of users actually in db
     * @method getUsers
     *
     * @param cb {Function}         Callback to get list of users
     * @return {Trap}               Return Trapjs instance
     */
    public getUsers(cb : (err : any, res : ILocalProtocolUserPublic[]) => void) : Trap {
        this._protocolUsed.getUsers(cb);
        return this;
    }

    public injectProtocols() : void {

    }

    /**
     * Lock account manually
     * @method lockAccount
     *
     * @param accountID {string}    AccountID
     * @param time {number}         Optional lock time in seconds
     * @return {Trap}               Return Trapjs instance
     */
    public lockAccount(accountID : string, time ?: number) : Trap {
        this._protocolUsed.lockAccount(accountID, time);
        return this;
    }

    /**
     * Check if user/account are allowed to auth
     * @method loginAttempt
     *
     * @param accountID {string}    Account ID for auth
     * @param ip {string}           User IP for auth
     * @param cb {function}         Callback
     * @return {Trap}               Return Trapjs instance
     */
    public loginAttempt(accountID : string, ip : string, cb : (err : any) => void) : Trap {
        this._protocolUsed.loginAttempt(accountID, ip, cb);
        return this;
    }

    /**
     * Unban user manually
     * @method unbanUser
     *
     * @param ip {string|string[]}          IP(s) of user(s) who must be unbanned
     * @return {Trap}               Return Trapjs instance
     */
    public unbanUser(ip : string) : Trap {
        // Check if user send a list of IP or only simple IP
        if (_.isArray(ip)) {
            for (var i : number = 0, ls : number = ip.length; i < ls; i++) {
                this.unbanUser(ip[i]);
            }
        } else {
            // Launch unban user
            this._protocolUsed.unbanUser(ip);
        }
        return this;
    }

    /**
     * Unlock account manually
     * @method unlockAccount
     *
     * @param accountID {string}    Account ID for unlock
     * @return {Trap}               Return Trapjs instance
     */
    public unlockAccount(accountID : string) : Trap {
        // Check if user send a list of IP or only simple IP
        if (_.isArray(accountID)) {
            for (var i : number = 0, ls : number = accountID.length; i < ls; i++) {
                this.unlockAccount(accountID[i]);
            }
        } else {
            // Launch unban user
            this._protocolUsed.unlockAccount(accountID);
        }
        return this;
    }

    /**
     * Use specific protocol
     * @method useProtocol
     *
     * @param protocol {string}     Protocol configuration
     * @param cb {Function}         Optional callback
     */
    public useProtocol(protocol : any, cb ?: Function) : Trap {
        // Check if Trapjs is ready ofr use
        if (this._ready || this._protocols[protocol.protocol]) {
            // Check if protocol is available
            if (this._protocols[protocol.protocol]) {
                // Assign protocol
                this._protocolUsed = this._protocols[protocol.protocol];

                // Debug
                //console.log('Trapjs :: Use protocol : ' + protocol.name);

                // Init protocol
                this._protocolUsed.boot(protocol, function() {
                    // Launch callback if exist
                    if (cb) {
                        cb();
                    }

                    //console.log('Trapjs :: Protocol '+protocol.name+' is init with success');
                });
            } else {
                console.error('Trapjs :: Protocol no found : ' + protocol.protocol);
            }
        } else {
            // Scope
            var self : Trap = this;

            //console.log('Trapjs :: Add useProtocol callback in waiting');

            // Push function in waiting list
            this._waintingCallback.push(function() {
                self.useProtocol(protocol, cb)
            });
        }

        return this;
    }
}

export = new Trap();