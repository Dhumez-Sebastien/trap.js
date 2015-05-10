interface ILocalProtocolUser {
    attempts : ILocalProtocolUserAttempt[];
}

interface ILocalProtocolUserAttempt {
    account : string;
    date : number;
}
