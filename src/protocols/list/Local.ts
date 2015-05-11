///<reference path="./../../defLoader.d.ts" />

// TestApp.ts file
import Core = require("./../Core");
import _ = require("lodash");

/**
 * Local
 *
 * @module :: Local
 * @description	:: Local protocol.
 */
class Local extends Core {

    /**
     * ****************************************************
     * ******************* About Account ******************
     * ****************************************************
     */

    /**
     * Contains a list of account used for authentication in asc order
     *
     * @property _accountAttempts
     * @type {string[]}
     * @private
     */
    private _accountAttempts : string[] = [];

    /**
     * Contain the list of account currently locked
     *
     * @property _accountJail
     * @type {string[]}
     * @private
     */
    private _accountJail : string[] = [];

    /**
     * Contain information about account actually banned
     *
     * @property _accountJailInfo
     * @type {IAccountJailInfo[]}
     * @private
     */
    private _accountJailInfo : IAccountJailInfo[] = [];

    /**
     * Contains a list of accounts that have been used for connection
     *
     * @property _accountList
     * @type {string[]}
     * @private
     */
    private _accountList : string[] = [];

    /**
     * ****************************************************
     * ******************** About User ********************
     * ****************************************************
     */

    /**
     * Contains a list of IP address used for authentication in asc order
     *
     * @property _userAttempts
     * @type {string[]}
     * @private
     */
    private _userAttempts : string[] = [];

    /**
     * Contain the list of user currently banned
     *
     * @property _userJail
     * @type {string[]}
     * @private
     */
    private _userJail : string[] = [];

    /**
     * Contain information about user actually banned
     *
     * @property _userJailInfo
     * @type {IUserJailInfo[]}
     * @private
     */
    private _userJailInfo : IUserJailInfo[] = [];

    /**
     * Contain the list of user who have submit login form
     *
     * @property _userList
     * @type {ILocalProtocolUser[]}
     * @private
     */
    private _userList : ILocalProtocolUser[] = [];

    /**
     * Contain the list of user IP with a permanent access
     *
     * @property _IPWhiteList
     * @type {string[]}
     * @private
     */
    private _IPWhiteList : string[] = [];

    /**
     * Basic constructor
     *
     * @param jailConfig {IJailConfig}      Jail configuration
     */
    public constructor(jailConfig : IJailConfig) {
        super(jailConfig);

        // Init name of protocol
        this._protocolName = 'local';
    }

    /**
     * *************************************************************
     * *************************************************************
     * ********************* Private methods ***********************
     * *************************************************************
     * *************************************************************
     */

    /**
     * Check if account IP is locked
     * @method _accountIsLocked
     * @private
     *
     * @param accountID {string}    AccountID
     * @return {boolean}            Return true if account is locked else false
     */
    private _accountIsLocked(accountID : string) : boolean {
        return _.indexOf(this._accountJail, accountID) != -1;
    }

    /**
     * Used to remove old login attempts
     * @private
     *
     * @method _clearQueue
     */
    private _clearQueue() : void {
        // Calculate current find time of user
        var userFindTime : number = Date.now() - this._userFindTime;

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
        var accountFindTime : number = Date.now() - this._accountFindTime;

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

        // Unban user
        for (var i : number = 0, ls : number = this._userJail.length; i < ls; i++) {
            if (this._userJailInfo[this._userJail[i]].endBan < Date.now()) {
                delete (this._userJailInfo[this._userJail[i]]);
                this._userJail.splice(i, 1);
                i--;
                ls--;
            }
        }

        // Unlock account
        for (var i : number = 0, ls : number = this._accountJail.length; i < ls; i++) {
            if (this._accountJailInfo[this._accountJail[i]].endLock < Date.now()) {
                delete (this._accountJailInfo[this._accountJail[i]]);
                this._accountJail.splice(i, 1);
                i--;
                ls--;
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
     * Check if user IP is banned
     * @method _userIsBanned
     * @private
     *
     * @param ip {string}       IP address of user
     * @return {boolean}        Return true if user is banned else false
     */
    private _userIsBanned(ip : string) : boolean {
        return _.indexOf(this._userJail, ip) != -1;
    }

    /**
     * *************************************************************
     * *************************************************************
     * ********************** Public methods ***********************
     * *************************************************************
     * *************************************************************
     */

    /**
     * Add a new connection attempt
     * @method addAttempt
     *
     * @param accountID {string}    Account ID for auth
     * @param userIP {string}       User IP for auth
     */
    public addAttempt(accountID : string, userIP : string) : void {
        super.addAttempt(accountID, userIP);

        // Check if user is not already banned and account locked
        if (this._userIsBanned(userIP) || (this._accountLockEnable && this._accountIsLocked(accountID))) {
            return;
        }

        /**
         * ***************************************************
         * **************** Add user attempt *****************
         * ***************************************************
         */

        // Check if user IP is in list
        if (!this._userList[userIP]) {
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

        // Check if user attempt is not > max retry
        if (this._userList[userIP].attempts.length >= this._userMaxRetry) {

            // Send user into jail
            this._userJail.push(userIP);

            // Store info about end of ban
            this._userJailInfo[userIP] = {
                endBan : Date.now() + this._userBanTime
            }
        }

        /**
         * ***************************************************
         * ************** Add account attempt ****************
         * ***************************************************
         */

        // Check if account locker is currently enable
        if (this._accountLockEnable) {

            // Check if account is in list
            if (!this._accountList[accountID]) {
                this._accountList[accountID] = {
                    lockTimestamp: 0,
                    attempts: []
                };
            }

            // Add account attempt
            this._accountList[accountID].attempts.push({
                ip: userIP,
                date: Date.now()
            });

            // Add new account attempt
            this._accountAttempts.push(accountID);

            // Check if account attempt is not > max retry
            if (this._accountList[accountID].attempts.length >= this._accountMaxRetry) {
                // Send user into jail
                this._accountJail.push(accountID);

                // Store info about end of ban
                this._accountJailInfo[accountID] = {
                    endLock : Date.now() + this._accountLockTime
                }
            }
        }
    }

    /**
     * Add a new IP address in white list
     * @method allowIP
     *
     * @param ip {string}       IP address of user allowed
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
     * Ban user manually
     * @method banUser
     *
     * @param ip {string}       IP address of user
     * @param time {number}     Optional ban time in seconds
     */
    public banUser(ip : string, time ?: number) : void {
        // Calculate new time of ban
        var customTime : number = (time) ? time * 1000 : this._userBanTime;

        // Check if user is already banned
        if (this._userIsBanned(ip)) {
            // Add more ban time
            this._userJailInfo[ip].endBan = Date.now() + customTime;
        } else {
            // Send user into jail
            this._userJail.push(ip);

            // Store info about end of ban
            this._userJailInfo[ip] = {
                endBan : Date.now() + customTime
            }
        }
    }

    /**
     * Lock account manually
     * @method lockAccount
     *
     * @param accountID {string}    AccountID
     * @param time {number}         Optional lock time in seconds
     */
    public lockAccount(accountID : string, time ?: number) : void {
        // Check if account locker is enabled
        if (!this._accountLockEnable) {
            console.log('Trapjs :: You try lock manually account but system is currently off (jailConfig.accountLockEnable = false)');
            return;
        }

        // Calculate new time of ban
        var customTime : number = (time) ? time * 1000 : this._accountLockTime;

        // Check if user is already banned
        if (this._accountIsLocked(accountID)) {
            // Add more ban time
            this._accountJailInfo[accountID].endLock = Date.now() + customTime;
        } else {
            // Send user into jail
            this._accountJail.push(accountID);

            // Store info about end of ban
            this._accountJailInfo[accountID] = {
                endLock : Date.now() + customTime
            }
        }
    }

    /**
     * Check if user/account are allowed to auth
     * @method loginAttempt
     *
     * @param accountID {string}    Account ID for auth
     * @param userIP {string}       User IP for auth
     * @param cb {function}         Callback
     */
    public loginAttempt(accountID : string, userIP : string, cb : (err ?: any) => void) : void {
        // Debug
        //console.log('Trapjs :: Protocol local :: Login attempt');

        // Clear queue
        this._clearQueue();

        // Check if user is allowed to go next immediatly
        if (this._userIsAllowed(userIP)) {
            cb();
        }

        // Check if user is banned and get back error
        else if (this._userIsBanned(userIP)) {
            // Send callback with error
            cb(
                {
                    code : 'E_USER_BAN',
                    user : {
                        banTime : (this._userJailInfo[userIP].endBan - Date.now()) / 1000
                    }
                }
            );
        }
        // Check account
        else if (this._accountLockEnable && this._accountIsLocked(accountID)) {
            // Send callback with error
            cb(
                {
                    code : 'E_ACCOUNT_LOCK',
                    account : {
                        lockTime : (this._accountJailInfo[accountID].endLock - Date.now()) / 1000
                    }
                }
            );
        }
        // No one locked, send callback
        else {
            // Send callback
            cb();
        }
    }

    /**
     * Unban user manually
     * @method unbanUser
     *
     * @param ip {string}       IP of user who must be unbanned
     */
    public unbanUser(ip : string) : void {
        // Get index of user
        var userIndex : number = _.indexOf(this._userJail, ip);

        // Check if user in really in jail or not
        if (userIndex != -1) {
            delete (this._userJailInfo[ip]);
            this._userJail.splice(userIndex, 1);

            // Remove attempt from user
            if (this._userList[ip]) {
                // Clear array
                while (this._userList[ip].attempts.length > 0) {
                    this._userList[ip].attempts.pop();
                }

                // And remove user proprely
                delete (this._userList[ip]);
            }

            // Remove all attempt user from list
            while (_.indexOf(this._userAttempts, ip) != -1) {
                var index : number = (_.indexOf(this._userAttempts, ip));
                this._userAttempts.splice(index, 1);
            }
        }
    }

    /**
     * Unlock account manually
     * @method unlockAccount
     *
     * @param accountID {string}    Account ID for unlock
     */
    public unlockAccount(accountID : string) : void {
        // Check if account locker is enabled
        if (!this._accountLockEnable) {
            return;
        }

        // Get index of account
        var accountIndex : number = _.indexOf(this._accountJail, accountID);

        // Check if account in really in jail or not
        if (accountIndex != -1) {
            delete (this._accountJailInfo[accountID]);
            this._accountJail.splice(accountIndex, 1);

            // Remove attempt from account
            if (this._accountList[accountID]) {
                // Clear array
                while (this._accountList[accountID].attempts.length > 0) {
                    this._accountList[accountID].attempts.pop();
                }

                // And remove account proprely
                delete (this._accountList[accountID]);
            }

            // Remove all attempt account from list
            while (_.indexOf(this._accountAttempts, accountID) != -1) {
                var index : number = (_.indexOf(this._accountAttempts, accountID));
                this._accountAttempts.splice(index, 1);
            }
        }
    }
}

// Export Local protocol
export = Local;