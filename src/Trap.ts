///<reference path="./defLoader.d.ts" />

import Redis = require("./protocols/list/Redis");
import fs = require('fs');
import path = require('path');

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
     *
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
    public banUser(ip : string, time ?: number) : void {
        this._protocolUsed.banUser(ip, time);
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

    public getAccounts() : any[] {
        return [];
    }

    public getBannedUsers() : any[] {
        return [];
    }

    public getLockedAccounts() : any[] {
        return [];
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


    public getUsers() : any[] {
        return [];
    }

    public injectProtocols() : void {

    }

    public lockAccount(accountID : string, time ?: number) : void {

    }

    public loginAttempt(accountID : string, userIP : string, cb : (err : any) => void) : Trap {
        this._protocolUsed.loginAttempt(accountID, userIP, cb);
        return this;
    }

    /**
     * Unban user manually
     * @method unbanUser
     *
     * @param userIP {string}       IP of user who must be unbanned
     */
    public unbanUser(userIP : string) : void {
        this._protocolUsed.unbanUser(userIP);
    }

    public unlockAccount(accountID : string) : void {

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