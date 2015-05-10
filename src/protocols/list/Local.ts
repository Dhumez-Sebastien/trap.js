///<reference path="./../../defLoader.d.ts" />

// TestApp.ts file
import Core = require("./../Core");
import _ = require("lodash");

class Local extends Core {

    /**
     * Contains a list of accounts that have been used for connection
     * @type {string[]}
     * @private
     */
    private _accountList : string[] = [];

    /**
     * Contains a list of account used for authentication in asc order
     * @type {string[]}
     * @private
     */
    private _accountAttempts : string[] = [];

    /**
     * Contain the list of user who have submit login form
     * @type {string[]}
     * @private
     */
    private _userList : string[] = [];

    /**
     * Contains a list of IP address used for authentication in asc order
     * @type {string[]}
     * @private
     */
    private _userAttempts : string[] = [];

    /**
     * Contain the list of user IP with a permanent access
     * @type {string[]}
     * @private
     */
    private _IPWhiteList : string[] = [];

    /**
     * Basic constructor
     */
    public constructor() {
        super();

        // Init name of protocol
        this._protocolName = 'local';
    }

    /**
     * Used to remove old login attempts
     * @private
     *
     * @method _clearQueue
     */
    private _clearQueue() : void {
        // Debug
        console.log('Clear queue');

        // Calculate current find time of user
        var userFindTime : number = Date.now() - (this._userFindTime * 1000);

        // Check last user attempts
        for (var i : number = 0, ls = this._userAttempts.length; i < ls; i++) {
            // Check if attempt may be removed
            if (this._userList[this._userAttempts[i]].attempts[0].date < userFindTime) {
                this._userList[this._userAttempts[i]].attempts.shift();

                // Check if user got
                if (this._userList[this._userAttempts[i]].attempts.length == 0) {
                    delete (this._userList[this._userAttempts[i]]);
                }

                // Remove first IP cause he's clear
                this._userAttempts.shift();

                // Decrease index
                ls--;
                i--;
            } else {
                // The others user attempts must be stay in memory cause there not expired
                break;
            }
        }

        // Calculate current find time of account
        var accountFindTime : number = Date.now() - (this._accountFindTime * 1000);

        // Same but with accounts
        for (var i : number = 0, ls = this._accountAttempts.length; i < ls; i++) {
            // Check if attempt may be removed
            if (this._accountList[this._accountAttempts[i]].attempts[0].date < accountFindTime) {
                this._accountList[this._accountAttempts[i]].attempts.shift();

                // Check if user got
                if (this._accountList[this._accountAttempts[i]].attempts.length == 0) {
                    delete (this._accountList[this._accountAttempts[i]]);
                }

                // Remove first IP cause he's clear
                this._accountAttempts.shift();

                // Decrease index
                ls--;
                i--;
            } else {
                // The others user attempts must be stay in memory cause there not expired
                break;
            }
        }
    }

    /**
     * Check if user IP is in white list
     * @method _userIsAllowed
     * @private
     *
     * @param ip {string}       IP address of user
     * @return {boolean}        Return true if user is allowed else false
     */
    private _userIsAllowed(ip : string) : boolean {
        return _.indexOf(this._IPWhiteList, ip) > -1;
    }

    /**
     * Add a new IP address in white list
     * @method allowIP
     *
     * @param ip {string}       IP adress of user allowed
     * @return {boolean}        Return true if IP is added or false is she's already in DB
     */
    public allowIP(ip : string) : boolean {
        if (_.indexOf(this._IPWhiteList, ip) == -1) {
            this._IPWhiteList.push(ip);
            return true;
        }

        return false;
    }

    /**
     * Init protocol
     *
     * @method boot
     */
    public boot(protocolConfig : IRedisProtocolConfig, cb : Function) : void {

    }

    public loginAttempt(accountID : string, userIP : string, cb : (err ?: any) => void) : void {
        // Debug
        console.log('Trapjs :: Protocol local :: Login attempt');

        // Clear queue
        this._clearQueue();

        // Check if user is allowed to go next immediatly
        if (this._userIsAllowed(userIP)) {
            cb();
        } else {
            // Check if user IP is in list
            if (_.indexOf(this._userList, userIP) == -1) {
                //_.findKey(this._userList, 'ip', userIP);

                this._userList[userIP] = {
                    banTimestamp : 0,
                    attempts : []
                };
            }

            // Add attempt
            this._userList[userIP].attempts.push({
                account : accountID,
                date : Date.now()
            });

            // Add new user attempt
            this._userAttempts.push(userIP);

            // Check if account is in list
            if (_.indexOf(this._accountList, accountID) == -1) {
                this._accountList[accountID] = {
                    lockTimestamp : 0,
                    attempts : []
                };
            }

            // Add account attempt
            this._accountList[accountID].attempts.push({
                ip : userIP,
                date : Date.now()
            });

            // Add new account attempt
            this._accountAttempts.push(accountID);

            // Send callback
            cb();
        }
    }
}

// Export Local protocol
export = Local;