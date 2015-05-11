# trap.js
Protect your app against brute force tentatives.

# Quick Start

## Install
```shell
$ npm install trapjs
```

## Basic Usage

```javascript
// Include Trapjs
var trapjs = require('trapjs');

// Basic login attempt
trapjs.loginAttempt('accountID', '0.0.0.0', function(err) {
    if (err) {
        // err.code                     :: 'E_ACCOUNT_LOCK' :: Account is temporary locked
        // err.code                     :: 'E_USER_BAN'     :: User is temporary banned
        // err.account.lockTime         :: 173 :: Time remaining until unlock account
        // err.user.banTime             :: 125 :: Time remaining until unban
    } else {
        // Begin connection request
        
        if (login == 'yourLogin' && password == 'password') {
            // Your members look's like OK
        } else {
            // Add an attempt into Trapjs cause, wrong login/password
            trapjs.addAttempt('accountID', '0.0.0.0');
        }
    }
});

/*
The "loginAttempt" method check if account and ip are not banned/locked.

DO NOT FORGET TO ADD ATTEMPT WITH "trapjs.addAttempt('accountID', '0.0.0.0');"
This method will be used to lock account or ban the user if repeated authentication.
*/
```

## Configure protocols

Actually in dev but Local protocol works correctly

```javascript
/*
// The default protocol used by  Trapjs the "local protocol" but you can define an other (redis for example).
redisProtocol = {
    protocol : 'redis',
    port: 6379,             // Redis port
    host: '127.0.0.1',      // Redis host
    family: 4,              // 4(IPv4) or 6(IPv6)
    password: 'auth',       // Redis password
    db: 0,                  // db 0
    dbPrefix : '__trap'     // Data prefix
};

// Define the new protocol
trapjs.useProtocol(redisProtocol);

// Schema of local protocol
localProtocol = {
    protocol : 'local'
};*/
```

## Configure jails

```javascript
// You can customise jail configuration (this is the default configuration)
var jailConfig = {
    accountLockEnable : true,   // Enables accounts protection
    accountFindTime : 3600,     // Store login attempt on account during 1 hours
    accountLockTime : 600       // Lock account during 10 minutes
    accountMaxRetry : 15        // 15 connexion attempt before lock account temporary
    userFindTime : 3600,        // 1 hour by default
    userBanTime : 7200          // Ban IP during 2 hours
    userMaxRetry : 10           // 10 connexion attempt before ban user
};

// Apply configuration
trapjs.configJail(jailConfig);
```

## Some usefull utils

```javascript
// Unban user
trapjs.unbanUser('0, 0, 0, 0');

// Ban user during selected time
trapjs.banUser('0, 0, 0, 0', 3600);

// Unlock account
trapjs.unlockAccount('accountID');

// Lock account during time
trapjs.lockAccount('accountID', 3600);

// Allow IPs for direct login attempt
trapjs.allowIP(['0, 0, 0, 0', '127.0.0.1']);

// Get the list of users actually banned -- In dev
/*trapjs.getBannedUsers(function(res) {
    console.log(res);
    
    // res[0].ip        :: 0.0.0.0
    // res[0].banTime   :: 162
});*/

// Get the list of users
/*trapjs.getUsers(function(res) { -- In dev
    console.log(res);
    
    // res[0].ip        :: 0.0.0.0
    // res[0].retry     :: [199787640000, 199787640010, 199787640030]
    // res[0].unbanTime :: 199787650050
});*/

// Get the list of accounts actually locked
/*trapjs.getLockedAccounts(function(res) { -- In dev
    console.log(res);
    
    // res[0].account   :: accountID
    // res[0].lockTime  :: 162
});*/

// Get the list of accounts
/*trapjs.getAccounts(function(res) { -- In dev
    console.log(res);
    
    // res[0].account   :: accountID
    // res[0].retry     :: [199787640000, 199787640010, 199787640030]
    // res[0].unlockTime :: 199787650050
});*/

```

# Running tests

Start a Redis server on 127.0.0.1:6379, and then:

```shell
$ npm test
```

`FLUSH ALL` will be invoked after each test, so make sure there's no valuable data in it before running tests.

# Join in!

I'm happy to receive bug reports, fixes, documentation enhancements, and any other improvements.

And since I'm not an English native speaker (i'm French :p) so if you find any grammar mistake in the documentation, please also let me know. :)

# RoadMap

* Finish correctly Local protocol
* Implements Redis protocol (with ioredis)