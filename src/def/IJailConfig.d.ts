interface IJailConfig {
    accountLockEnable ?: boolean;   // true :: Enables accounts protection
    accountFindTime ?: number;      // 3600 :: Store login attempt on account during 1 hours
    accountLockTime ?: number;      // 600 :: Lock account during 10 minutes
    accountMaxRetry ?: number;      // 15 :: connexion attempt before lock account temporary
    userFindTime ?: number;         // 3600 :: 1 hour by default
    userBanTime ?: number;          // 7200 :: Ban IP during 2 hours
    userMaxRetry ?: number;         // 10 :: connexion attempt before ban user
}