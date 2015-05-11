interface ILocalProtocolAccount {
    attempts : ILocalProtocolAccountAttempt[];
}

interface ILocalProtocolAccountPublic extends ILocalProtocolAccount {
    endLock ?: number;       // If account is banned
    accountID : string;
}

interface ILocalProtocolAccountAttempt {
    ip : string;
    date : number;
}