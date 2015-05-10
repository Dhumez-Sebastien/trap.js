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
    public boot() : void {

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
     * Load protocol for use
     *
     * @method loadProtocol
     */
    public loadProtocol() : void {

    }
}

// Export Local protocol
export = Core;
