///<reference path="./../../defLoader.d.ts" />

// TestApp.ts file
import Core = require("./../Core");
import _ = require("lodash");

class Local extends Core {

    /**
     * Contain the list of user IP who have submit login form
     * @type {string[]}
     * @private
     */
    private _IPList : string[] = [];

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
    public boot() : void {
        super.boot();
    }

    /**
     * Load protocol for use
     *
     * @method loadProtocol
     */
    public loadProtocol() : void {

    }

}

// Export Local protocol
export = Local;