///<reference path="./defLoader.d.ts" />

/**
 * That used to get the number of attempt connexion of an IP or on account
 * It's used to prevent Brute Force || Flood connexion on server
 */
class LogAttempt {
    /**
     * The last logging attempt
     */
    private lastAttempt : number = Date.now();

    /**
     * Allow to check if IP is locked temporary
     */
    private locked : boolean =  false;

    /**
     * The sum of logging attempt
     */
    private loginAttempt : number = 0;


    constructor() {
        // Empty
    }

    /**
     * Add a connect attemptand return if account is locked or not
     */
    private addAttempt() : boolean {
        // Authorizes 1 connexion all 10 secs
        // TODO Define time later
        if (this.lastAttempt > Date.now() - 10000) {
            this.loginAttempt++;
        }

        // Update attempt time
        this.lastAttempt = Date.now();

        // Check the number of logging attempt and lock account if we need
        if (this.loginAttempt > 5) {
            this.locked = true;
            return true;
        }

        return false;
    }

    /**
     * Get the number of connexion attempt
     */
    public getAttempt() : number {
        return this.loginAttempt;
    }

    /**
     * Get the locked status
     */
    public getLocked() : boolean {
        return this.locked;
    }

    /**
     * Check if user||account is locked
     */
    public isLocked() : boolean {
        // If user IP is locked || Account, check the time to unlock him
        if (this.locked) {
            // Check if last logging attempt is more than 5 minutes
            if (this.lastAttempt < (Date.now() - (1000*60*5))) {
                this.locked = false;
                this.loginAttempt = 0;

                // Account is now unlock, add an attempt
                this.addAttempt();

                // And say account was not locked
                return false;
            } else {
                // Account is locked for the moment...
                return true;
            }
        } else {
            // Account is not locked for moment, but add an attempt and get it back
            return this.addAttempt();
        }
    }
}

export = LogAttempt;