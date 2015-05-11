interface IUserJailInfo {
    // Contain all user attempts
    attempts : ILocalProtocolUserAttempt[];

    // Contains the date with ban action expire
    endBan : number;
}

/**
 * User in method getBannedUsers to get ip of user banned
 */
interface IUserJailInfoPublic extends IUserJailInfo {
    ip : string;
}
