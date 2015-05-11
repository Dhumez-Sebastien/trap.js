interface ILocalProtocolUser {
    attempts : ILocalProtocolUserAttempt[];
}

interface ILocalProtocolUserPublic extends ILocalProtocolUser {
    endBan ?: number;       // If user is banned
    ip : string;
}

interface ILocalProtocolUserAttempt {
    accountID : string;
    date : number;
}
