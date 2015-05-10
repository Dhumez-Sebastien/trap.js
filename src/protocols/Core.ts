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
    protected _accountFindTime : number = 3600;

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
    protected _accountLockTime : number = 600;

    /**
     * Number of attempt before lock account (15 by default)
     *
     * @property _accountMaxRetry
     * @type {number}
     * @protected
     */
    protected _accountMaxRetry : number = 15;

    /**
     * Time during which the connection attempt stay in memory (in seconds) (3600 by default)
     *
     * @property _userFindTime
     * @type {number}
     * @protected
     */
    protected _userFindTime : number = 3600;

    /**
     * Time during user IP is locked
     *
     * @property _userBanTime
     * @type {number}
     * @protected
     */
    protected _userBanTime : number = 7200;

    /**
     * Number of attempt before ban user (10 by default)
     *
     * @property _userMaxRetry
     * @type {number}
     * @protected
     */
    protected _userMaxRetry : number = 10;

    /**
     * Add a new IP address in white list
     * @method allowIP
     *
     * @param ip {string}       IP adress of user allowed
     */
    public allowIP(ip : string) : void {

    }

    /**
     * Init protocol
     *
     * @method boot
     */
    public boot(protocolConfig : IRedisProtocolConfig, cb : Function) : void {

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

    public loginAttempt(accountID : string, userIP : string, cb : (err ?: any) => void) : void {

    }
}

// Export Local protocol
export = Core;
