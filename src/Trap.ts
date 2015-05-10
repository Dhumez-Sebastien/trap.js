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
     * The name of protocol
     * @type {string}
     * @private
     */
    /**
     * Contains the list of protocols availables as object :: _protocols.redis ; _protocols.local
     *
     * @property _protocols
     * @type {Trapjs.Protocols.Core[]}
     * @private
     */
    private _protocols : Trapjs.Protocols.Core[] = [];

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
            files.filter(function(file) { return file.substr(-3) === '.js'; })
                .forEach(function(file) {
                    self._loadProtocol(file);
                });
        });
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

    public lockAccount(accountID : string, time ?: number) : void {

    }


    public loginAttempt(accountID : string, userIP : string, cb : (err : any) => void) : Trap {
        return this;
    }

    public unbanUser(userIP : string) : void {

    }

    public unlockAccount(accountID : string) : void {

    }


    public useProtocol(protocol : any, cb ?: () => void) : Trap {

        if (protocol.name == 'redis') {
            var RedisProtocol = require("./protocols/list/Redis");



            var protocolUsed = new RedisProtocol().loadProtocol(protocol, cb);
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