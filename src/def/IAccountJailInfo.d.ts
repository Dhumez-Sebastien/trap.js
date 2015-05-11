interface IAccountJailInfo {
    // Contain all user attempts
    attempts : ILocalProtocolAccountAttempt[];

    // Contains the date with lock action expire
    endLock : number;
}

interface IAccountJailInfoPublic extends IAccountJailInfo {
    // Account id locked
    accountID : string;
}