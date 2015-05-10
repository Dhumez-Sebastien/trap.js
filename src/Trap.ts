///<reference path="./defLoader.d.ts" />

import LogAttempt = require("./LogAttempt");
import Redis = require("./protocols/list/Redis");

/**
 * Trap
 *
 * @module :: Trap
 * @description	:: The main file of Trapjs.
 */
class Trap {
    /**
     * Contain the list of IP Address who trying connexion
     */
    static IPLogList : any = [];

    /**
     * The list of account were the tentative connexion was made
     */
    static accLogList : any ;

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
        // Load Protocols available
        console.log('Loading protocols');

        var fs = require('fs')
            , path = require('path')
            , self : Trap = this;

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
        console.log('Loading protocol : '+filename);

        // Load protocol from files
        var protocol = require(__dirname+'/protocols/list/'+filename),
            build = new protocol();

        // Add protocol in list
        this._protocols[build.getName()] = build;

        // Select local protocol by default
        if (!this._protocolUsed && build.getName() === 'local') {
            this.useProtocol({name : 'local'});
        }
    }

    public allowIP(userIP : string[]) : void {

    }


    public banUser(userIP : string, time ?: number) : void {

    }


    public configJail(jailConfiguration : any) : Trap {
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

    public unbanUser(userIP : string) : void {

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
        if (this._ready || this._protocols[protocol.name]) {
            // Check if protocol is available
            if (this._protocols[protocol.name]) {
                // Assign protocol
                this._protocolUsed = this._protocols[protocol.name];

                // Debug
                console.log('Trapjs :: Use protocol : ' + protocol.name);

                // Init protocol
                this._protocolUsed.boot(protocol, function() {
                    // Launch callback if exist
                    if (cb) {
                        cb();
                    }

                    console.log('Trapjs :: Protocol '+protocol.name+' is init with success');
                });
            } else {
                console.error('Trapjs :: Protocol no found : ' + protocol.name);
            }
        } else {
            // Scope
            var self : Trap = this;

            console.log('Trapjs :: Add useProtocol callback in waiting');

            // Push function in waiting list
            this._waintingCallback.push(function() {
                self.useProtocol(protocol, cb)
            });
        }

        return this;
    }


    /**
     * Check how much an account receive a connection attempt and blocks him where brute force
     * @param accountLogin                  The account login checked
     */
    static checkAccountAttempt(accountLogin : string) : boolean {

        // Get account name
        var accLog : string = accountLogin.toLowerCase();

        // Check if account is in memory
        if (!this.accLogList[accLog]) {
            this.accLogList[accLog] = new LogAttempt();
        }

        // For DEBUG
        console.log('Account login attempt : '+accountLogin+" | Number of Attempt : "+this.accLogList[accLog].getAttempt()+" | Account locked : "+this.accLogList[accLog].getLocked());

        // Get back the result of login attempt
        return !this.accLogList[accLog].isLocked();
    }

    /**
     * Check how much attempt an user send try connect to an account and block him where brute force tentative
     * @param userIP                        The user IP checked
     */
    static checkUserAttempt(userIP : string) : boolean {

        // Check if IP is in memory
        if (!this.IPLogList[userIP]) {
            this.IPLogList[userIP] = new LogAttempt();
        }

        // For DEBUG
        console.log('IP try connect attempt | IP : '+userIP+" | Number of Attempt : "+this.IPLogList[userIP].getAttempt()+" | IP locked : "+this.IPLogList[userIP].getLocked());

        // Get back the result of login attempt
        return !this.IPLogList[userIP].isLocked();
    }
}

export = new Trap();