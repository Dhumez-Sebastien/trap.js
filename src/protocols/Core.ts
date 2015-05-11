///<reference path="./../defLoader.d.ts" />

/**
 * Core
 *
 * @module :: Core
 * @description	:: The Core class of all Protocols.
 */
class Core {

    /**
     * The name of protocol
     * @type {string}
     * @protected
     */
    protected _protocolName : string = '';

    /**
     * Time during which the connection attempt stay in memory (in seconds) (3600 by default)
     *
     * @property _accountFindTime
     * @type {number}
     * @protected
     */
    protected _accountFindTime : number;

    /**
     * Enable or disable account locking protection (true by default)
     *
     * @property _accountLockEnable
     * @type {boolean}
     * @protected
     */
    protected _accountLockEnable : boolean = true;

    /**
     * Time during account is locked
     *
     * @property _accountLockTime
     * @type {number}
     * @protected
     */
    protected _accountLockTime : number;

    /**
     * Number of attempt before lock account (15 by default)
     *
     * @property _accountMaxRetry
     * @type {number}
     * @protected
     */
    protected _accountMaxRetry : number;

    /**
     * Time during which the connection attempt stay in memory (in seconds) (3600 by default)
     *
     * @property _userFindTime
     * @type {number}
     * @protected
     */
    protected _userFindTime : number;

    /**
     * Time during user IP is locked
     *
     * @property _userBanTime
     * @type {number}
     * @protected
     */
    protected _userBanTime : number;

    /**
     * Number of attempt before ban user (10 by default)
     *
     * @property _userMaxRetry
     * @type {number}
     * @protected
     */
    protected _userMaxRetry : number;

    /**
     * Basic constructor
     *
     * @param jailConfig {IJailConfig}      Jail configuration
     */
    public constructor(jailConfig : IJailConfig) {
        if (jailConfig) {
            // Account
            this._accountFindTime = (jailConfig.accountFindTime) ? jailConfig.accountFindTime : 3600 * 1000;
            this._accountLockEnable = (jailConfig.accountLockEnable == true);
            this._accountLockTime = (jailConfig.accountLockTime) ? jailConfig.accountLockTime : 600 * 1000;
            this._accountMaxRetry = (jailConfig.accountMaxRetry) ? jailConfig.accountMaxRetry : 15;

            // User
            this._userFindTime = (jailConfig.userFindTime) ? jailConfig.userFindTime : 3600 * 1000;
            this._userBanTime = (jailConfig.userBanTime) ? jailConfig.userBanTime : 7200 * 1000;
            this._userMaxRetry = (jailConfig.userMaxRetry) ? jailConfig.userMaxRetry : 10;
        }
    }

    /**
     * Add a new connection attempt
     * @method addAttempt
     *
     * @param accountID {string}    Account ID for auth
     * @param userIP {string}       User IP for auth
     */
    public addAttempt(accountID : string, userIP : string) : void {

    }

    /**
     * Add a new IP address in white list
     * @method allowIP
     *
     * @param ip {string}       IP address of user allowed
     */
    public allowIP(ip : string) : void {

    }

    /**
     * Ban user manually
     * @method banUser
     *
     * @param ip {string}       IP address of user
     * @param time {number}     Optional ban time in seconds
     */
    public banUser(ip : string, time ?: number) : void {

    }

    /**
     * Init protocol
     *
     * @method boot
     */
    public boot(protocolConfig : IRedisProtocolConfig, cb : Function) : void {
        cb();
    }

    /**
     * Update jails configuration
     *
     * @method configJail
     * @param jailConfig {IJailConfig}      Jail configuration
     */
    public configJail(jailConfig : IJailConfig) : void {
        if (jailConfig) {
            // Account
            if (jailConfig.accountFindTime) {
                this._accountFindTime = jailConfig.accountFindTime * 1000;
            }

            if (jailConfig.accountLockEnable != void 0) {
                this._accountLockEnable = !!jailConfig.accountLockEnable;
            }

            if (jailConfig.accountLockTime) {
                this._accountLockTime = jailConfig.accountLockTime * 1000;
            }

            if (jailConfig.accountMaxRetry) {
                this._accountMaxRetry = jailConfig.accountMaxRetry;
            }

            // User
            if (jailConfig.userFindTime) {
                this._userFindTime = jailConfig.userFindTime * 1000;
            }

            if (jailConfig.userBanTime) {
                this._userBanTime = jailConfig.userBanTime * 1000;
            }

            if (jailConfig.userMaxRetry) {
                this._userMaxRetry = jailConfig.userMaxRetry;
            }
        }
    }

    /**
     * Get the name of protocol
     *
     * @method getName
     * @return {string}     Name of protocol
     */
    public getName() : string {
        return this._protocolName;
    }

    /**
     * Lock account manually
     * @method lockAccount
     *
     * @param accountID {string}    AccountID
     * @param time {number}         Optional lock time in seconds
     */
    public lockAccount(accountID : string, time ?: number) : void {

    }

    public loginAttempt(accountID : string, userIP : string, cb : (err ?: any) => void) : void {

    }

    /**
     * Unban user manually
     * @method unbanUser
     *
     * @param userIP {string}       IP of user who must be unbanned
     */
    public unbanUser(userIP : string) : void {

    }

    /**
     * Unlock account manually
     * @method unlockAccount
     *
     * @param accountID {string}    Account ID for unlock
     */
    public unlockAccount(accountID : string) : void {

    }
}

// Export Local protocol
export = Core;
