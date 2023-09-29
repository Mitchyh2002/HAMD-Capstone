// Authorization Errors
export const AuthorizationErrors = {
    tokenMissing: 400,
    unauthorizedAccess: 401,
    permissionsInsufficient: 402,
    tokenInvalid: 403,
    permissionsSelf: 406,
    permissionsLimit: 407
};

// Admin Errors
export const aAddUserErrors = {
    emailInvalid: 11,
    emailTaken: 14,
    nameInvalid: 31,
    dateOfBirthInvalid: 41,
    phoneNumberInvalid: 51,
    phoneNumberTaken: 54
};

export const aResetPasswordErrors = {
    passwordEmpty: 20,
    accountInvalid: 62
}

// Confirm Errors
export const ConfirmErrors = {
    tokenInvalid: 60,
    accountConfirmed: 61,
};

// Karma Errors
export const KarmaErrors = {
    cannotFind: 2,
    missingFields: 3
};



// Module Errors
export const ScanFileErrors = {
    tableMissingPrefix: 10,
    moduleRestricted: 11,
    codeSyntax: 12,
    tablesMissing: 20,
    keysIncorrectFormat: 21
}

export const UpdatePageErrors = {
    keysMissing: 1,
    contentMissing: 2,
}

export const GetAllPagesErrors = {
    moduleNotFound: 10
}

export const CheckFilesErrors = {
    contentMissing: 4
}

export const FrontEndInstallErrors = {
    prefixNotinName: 10,
    exportFunctionMissing: 14,
    masterFileMissing: 15,
    masterFileChanged: 16
}

export const BackEndInstallErrors = {
    blueprintConflict: 3
}

export const TableInstallErrors = {
    tableConflict: 2
}

export const ModuleAccessErrors = {
    contentInvalid: 2,
    missingFields: 3
}

export const GiveUserAccessErrors = {
    permissionsInsufficient: 1
}

export const UpdateReferenceErrors = {
    missingFields: 3,
    passwordInvalid: 16
}

export const mActivateErrors = {
    moduleNotFound: 3
}

export const mDeactivateErrors = {
    moduleNotFound: 3
}

export const mUploadErrors = {
    moduleConflict: 1,
    tableConflict: 2,
    blueprintConflict: 3,
    tableMissingPrefix: 10,
    moduleRestricted: 11,
    codeSyntax: 12,
    passwordInvalid: 16,
    moduleMissing: 17,
    keysMissing: 18
}

// Setup Errors
export const CheckHexCodeErrors = {
    hexcodeInvalid: 1,
    hexValueInvalid: 2
}

export const CheckImageErrors = {
    imageMissing: 1,
    imageTypeInvalid: 2,
    imageNameInvalid: 3
}

export const UpdateConfigSettingsErrors = {
    settingMissing: 2
}

export const ConfigError = {
    configMissing: 405
}

export const CheckDBURLErrors = {
    urlInvalid: 1,
    connectionFailed: 2
}

// User errors
export const LoginErrors = {
    accountSuspended: 1,
    emailEmpty: 10,
    emailInvalid: 11,
    emailUnregistered: 13,
    passwordEmpty: 20,
    passwordWrong: 21,
    accountUncomfirmed: 30,
};

export const RegisterErrors = {
    emailEmpty: 10,
    emailInvalid: 11,
    emailTaken: 14,
    passwordEmpty: 20,
    nameEmpty: 30,
    nameInvalid: 31,
    dateOfBirthEmpty: 40,
    dateOfBirthInvalid: 41,
    phoneNumberInvalid: 51,
    phoneNumberTaken: 54,
};

export const ResetPasswordErrors = {
    passwordEmpty: 20,
    tokenInvalid: 60,
    accountInvalid: 62
};