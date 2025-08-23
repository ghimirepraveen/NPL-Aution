const AUTH = {
  VENDOR_NOT_VERIFIED: {
    TITLE: "Not Verified",
    MESSAGE: "Account not verified!",
    ERRORS: [
      {
        key: ["general"],
        message: ["Account not verified"],
      },
    ],
  },
  ACCOUNT_BLOCKED: {
    TITLE: "Account",
    MESSAGE: "Account is Blocked",
    ERRORS: [
      {
        key: ["general"],
        message: ["Account is Blocked"],
      },
    ],
  },
  EMAIL_ALREADY_TAKEN: {
    TITLE: "Account",
    MESSAGE: "Already Register",
    ERRORS: [
      {
        key: ["email"],
        message: ["Already Register"],
      },
    ],
  },
  EMAIL_VERIFIED: {
    TITLE: "Account",
    MESSAGE: "Already verified",
    ERRORS: [
      {
        key: ["email"],
        message: ["Already verified"],
      },
    ],
  },
  EMAIL_NOT_VERIFIED: {
    TITLE: "Account",
    MESSAGE: "Email not verified",
    ERRORS: [
      {
        key: ["email"],
        message: ["Email not verified"],
      },
    ],
  },

  ACCOUNT_NOT_FOUND: {
    TITLE: "Account",
    MESSAGE: "Account Not Found",
    ERRORS: [
      {
        key: ["email"],
        message: ["Account Not Found"],
      },
    ],
  },
  WRONG_OTP: {
    TITLE: "OTP",
    MESSAGE: "Wrong OTP",
    ERRORS: [
      {
        key: ["code"],
        message: ["Wrong OTP"],
      },
    ],
  },
  OTP_EXPIRED: {
    TITLE: "Login",
    MESSAGE: "OTP expired",
    ERRORS: [
      {
        key: ["code"],
        message: ["OTP Expired"],
      },
    ],
  },
  WRONG_CREDENTIAL: {
    TITLE: "Account",
    MESSAGE: "Wrong Credential",
    ERRORS: [
      {
        key: ["general"],
        message: ["Wrong Credential"],
      },
    ],
  },
  WRONG_CURRENT_PASSWRD: {
    TITLE: "Password",
    MESSAGE: "Wrong current password",
    ERRORS: [
      {
        key: ["general"],
        message: ["Wrong current password"],
      },
    ],
  },
  SAME_AS_OLD_PASSWRD: {
    TITLE: "Password",
    MESSAGE: "Same as old password",
    ERRORS: [
      {
        key: ["currentPassword"],
        message: ["Same as old password"],
      },
      {
        key: ["newPassword"],
        message: ["Same as old password"],
      },
    ],
  },

  LOGIN_OTP_SENT: {
    TITLE: "Login",
    MESSAGE: "Successfully sent OTP",
  },
  FORGOT_PASSWORD_MAIL: {
    TITLE: "Forgot Password",
    MESSAGE: "Successfully sent Mail",
  },

  LOGIN_SUCCESS: {
    TITLE: "Login",
    MESSAGE: "Successfully Login",
  },

  RESET_PASSWORD_SUCCESS: {
    TITLE: "Reset Password",
    MESSAGE: "Successfully Changed Password",
  },

  FAILED_TO_REGISTER: {
    TITLE: "Register",
    MESSAGE: "Failed to Register",
  },

  REGISTER_SUCCESS: {
    TITLE: "Register",
    MESSAGE: "Successfully Register, Check your mail for OTP to login",
  },
  LOGOUT_SUCCESS: {
    TITLE: "Logout",
    MESSAGE: "Successfully Logout",
  },

  REFRESH_INVALID: {
    TITLE: "Refresh Token",
    MESSAGE: "Invalid refresh token",
  },
  REFRESH_FAILED: {
    TITLE: "Refresh Token",
    MESSAGE: "Failed to get refresh token",
  },
  REFRESH_SUCCESS: {
    TITLE: "Refresh Token",
    MESSAGE: "Successfully got new refresh token",
  },
  PROFILE_UPDATE_FAILED: {
    TITLE: "Profile",
    MESSAGE: "failed to update",
  },
  PROFILE_UPDATE_SUCCESS: {
    TITLE: "Profile",
    MESSAGE: "Successfully updated",
  },
  PROFILE_GET_FAILED: {
    TITLE: "Profile",
    MESSAGE: "failed to get",
  },
  PROFILE_GET_SUCCESS: {
    TITLE: "Profile",
    MESSAGE: "Successfully got detail",
  },
  RESET_PASSWORD_SUCCESS: {
    TITLE: "Reset Password",
    MESSAGE: "Successfully Updated",
  },
  VERIFIED_SUCCESS: {
    TITLE: "Verification",
    MESSAGE: "Successfully Verified",
  },
};

const EMAIL = {
  GET_FAILED: {
    TITLE: "Email",
    MESSAGE: "Failed to get detail",
  },

  GET_SUCCESS: {
    TITLE: "Email",
    MESSAGE: "Successfully got detail",
  },
  GET_FAILED_LIST: {
    TITLE: "Email",
    MESSAGE: "Failed to get list",
  },
  GET_SUCCESS_LIST: {
    TITLE: "Email",
    MESSAGE: "Successfully got list",
  },
  UPDATE_FAILED: {
    TITLE: "Email",
    MESSAGE: "Failed to update",
  },

  UPDATE_SUCCESS: {
    TITLE: "Email",
    MESSAGE: "Successfully updated",
  },
};

const ADMIN = {
  CREATE_FAILED: {
    TITLE: "Admin",
    MESSAGE: "Failed to add",
  },

  CREATE_SUCCESS: {
    TITLE: "Admin",
    MESSAGE: "Successfully created",
  },

  GET_FAILED: {
    TITLE: "Admin",
    MESSAGE: "Failed to get detail",
  },

  GET_SUCCESS: {
    TITLE: "Admin",
    MESSAGE: "Successfully got detail",
  },
  GET_FAILED_LIST: {
    TITLE: "Admin",
    MESSAGE: "Failed to get list",
  },
  GET_SUCCESS_LIST: {
    TITLE: "Admin",
    MESSAGE: "Successfully got list",
  },
  UPDATE_FAILED: {
    TITLE: "Admin",
    MESSAGE: "Failed to update",
  },

  UPDATE_SUCCESS: {
    TITLE: "Admin",
    MESSAGE: "Successfully updated",
  },
  EMAIL_ALREADY_TAKEN: {
    TITLE: "Admin",
    MESSAGE: "Already Register",
    ERRORS: [
      {
        key: ["email"],
        message: ["Already Register"],
      },
    ],
  },

  STATS_SUCCESS: {
    TITLE: "Stats",
    MESSAGE: "Successfully got Stats",
  },
  STATS_FAILED: {
    TITLE: "Stats",
    MESSAGE: "Failed to get Stats",
  },
};

const TEAM = {
  CREATE_FAILED: {
    TITLE: "Team",
    MESSAGE: "Failed to add",
  },

  CREATE_SUCCESS: {
    TITLE: "Team",
    MESSAGE: "Successfully created",
  },

  GET_FAILED: {
    TITLE: "Team",
    MESSAGE: "Failed to get detail",
  },

  GET_SUCCESS: {
    TITLE: "Team",
    MESSAGE: "Successfully got detail",
  },
  GET_FAILED_LIST: {
    TITLE: "Team",
    MESSAGE: "Failed to get list",
  },
  GET_SUCCESS_LIST: {
    TITLE: "Team",
    MESSAGE: "Successfully got list",
  },
  UPDATE_FAILED: {
    TITLE: "Team",
    MESSAGE: "Failed to update",
  },

  UPDATE_SUCCESS: {
    TITLE: "Team",
    MESSAGE: "Successfully updated",
  },
  EMAIL_ALREADY_TAKEN: {
    TITLE: "Team",
    MESSAGE: "Already Register",
    ERRORS: [
      {
        key: ["email"],
        message: ["Already Register"],
      },
    ],
  },
};

const PLAYER = {
  CREATE_FAILED: {
    TITLE: "Player",
    MESSAGE: "Failed to add",
  },

  CREATE_SUCCESS: {
    TITLE: "Player",
    MESSAGE: "Successfully created",
  },

  GET_FAILED: {
    TITLE: "Player",
    MESSAGE: "Failed to get detail",
  },

  GET_SUCCESS: {
    TITLE: "Player",
    MESSAGE: "Successfully got detail",
  },
  GET_FAILED_LIST: {
    TITLE: "Player",
    MESSAGE: "Failed to get list",
  },
  GET_SUCCESS_LIST: {
    TITLE: "Player",
    MESSAGE: "Successfully got list",
  },
  UPDATE_FAILED: {
    TITLE: "Player",
    MESSAGE: "Failed to update",
  },

  UPDATE_SUCCESS: {
    TITLE: "Player",
    MESSAGE: "Successfully updated",
  },
  EMAIL_ALREADY_TAKEN: {
    TITLE: "Player",
    MESSAGE: "Already Register",
    ERRORS: [
      {
        key: ["email"],
        message: ["Already Register"],
      },
    ],
  },
};

const UPLOAD = {
  UPLOAD_FAILED: {
    TITLE: "File Upload",
    MESSAGE: "Failed to Upload",
  },
  UPLOAD_SUCCESS: {
    TITLE: "File Upload",
    MESSAGE: "Successfully Uploaded",
  },
};

const SITESETTING = {
  ADD_FAILED: {
    TITLE: "Site Setting",
    MESSAGE: "Failed to Updated",
  },

  ADD_SUCCESS: {
    TITLE: "Site Setting",
    MESSAGE: "Successfully Updated",
  },

  GET_FAILED: {
    TITLE: "Site Setting",
    MESSAGE: "Failed to get detail",
  },

  GET_SUCCESS: {
    TITLE: "Site Setting",
    MESSAGE: "Successfully got detail",
  },
  GET_FAILED_LIST: {
    TITLE: "Site Setting",
    MESSAGE: "Failed to get list",
  },
  GET_SUCCESS_LIST: {
    TITLE: "Site Setting",
    MESSAGE: "Successfully got list",
  },
  UPDATE_FAILED: {
    TITLE: "Site Setting",
    MESSAGE: "Failed to update",
  },

  UPDATE_SUCCESS: {
    TITLE: "Site Setting",
    MESSAGE: "Successfully updated",
  },

  DELETE_FAILED: {
    TITLE: "Site Setting",
    MESSAGE: "Failed to update",
  },

  DELETE_SUCCESS: {
    TITLE: "Site Setting",
    MESSAGE: "Successfully updated",
  },
};

module.exports = {
  AUTH,

  EMAIL,
  ADMIN,

  UPLOAD,

  TEAM,
  PLAYER,

  SITESETTING,
};
