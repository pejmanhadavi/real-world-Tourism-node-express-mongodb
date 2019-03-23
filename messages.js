/********************
 * GLOBAL
 */
exports.global = {
  ERROR: '',
  NOT_FOUND: '',
};

/*********************
 * CONTROLLER
 */
exports.auth_controller = {
    USER_REGISTERED_VERIFY_EMAIL: '',
    EMAIL_VERIFIED_NOW_LOGIN: '',
    RESET_EMAIL_SENT: '',
    RESET_PASSWORD_PAGE: '',
    PASSWORD_CHANGED: '',
    LOGGED_IN: '',
    TOKEN_REFRESHED: '',
};

exports.base_controller = {
    ID_MALFORMED: ''
};

exports.pay_controller = {
    SUCCESS_FULL_PAYMENT: ''
};

exports.profile_controller = {
    GET_PROFILE: '',
    PROFILE_UPDATED: '',
    PASSWORD_UPDATED: '',
    PROFILE_IMAGE_UPDATED: '',
    BACKGROUND_IMAGE_UPDATED: '',
    PROFILE_IMAGE_DELETED: '',
    BACKGROUND_IMAGE_DELETED: '',
};

exports.rate_controller = {
    RATED: '',
};

exports.rate_controller = {
    REQUEST_SENT: '',
    TOUR_LEADER_FIRST_VALIDATE: '',
    TOUR_LEADER_FINAL_VALIDATE: '',
    USER_FINAL_VALIDATE: '',
    USER_SATISFACTION: '',
    TOUR_LEADER_SATISFACTION: ''
};


exports.leader_controller = {
    TOUR_LEADER_REGISTER_WAIT_UNTIL_VERIFY: '',
    TOUR_LEADER_EDITED: '',
};
/**********************
 * DAO
 */
exports.experience_dao = {
  NO_EXPERIENCE: '',
  BAD_REQUEST: '',
};

exports.forgotPassword_dao = {
    NOT_FOUND_OR_ALREADY_USED: '',
    FORGOT_PASSWORD_NOT_FOUND: '',
    NOT_FOUND: '',
    RESET_EMAIL_SENTl: '',
};

exports.request_dao = {
    REQUEST_WITH_TOUR_LEADER_NOT_FOUND: '',
    REQUEST_NOT_FOUND: '',
    REQUEST_WITH_USER_NOT_FOUND: '',
    SATISFACTION_NOT_FOUND: '',
    SATISFACTION_ALREADY_EXISTS: '',
    REQUEST_NOT_FOUND_OR_RATED: '',
    NOT_FOUND_OR_PAID: '',
    REQUEST_WITH_FACTOR_NOT_FOUND: '',
};

exports.leader_dao = {
    LEADER_ALREADY_EXISTS: '',
    USER_IS_NOT_TOUR_LEADER: '',
    TOUR_LEADER_NOT_FOUND_OR_NOT_VERIFIED: '',
    LEADER_NOT_FOUND: '',
    BAD_REQUEST: '',
    SEND_SCAN_BIRTH_AND_LEADER_CARDS: '',
};

exports.userRefresh_dao = {
  REFRESH_TOKEN_NOT_FOUND: '',
};

exports.user_dao = {
    EMAIL_EXISTS: '',
    REGISTER: '',
    VERIFICATION_EXISTS: '',
    FIND_USER_BY_EMAIL: '',
    PASSWORDS_DO_NOT_MATCH: '',
    USER_BLOCKED: '',
    USER_NOT_FOUND: '',
    WRONG_CURRENT_PASSWORD: '',
};
/*******************
 * VALIDATION
 */
exports.auth_validation = {
    NAME_MISSING: '',
    NAME_IS_EMPTY: '',
    EMAIL_MISSING: '',
    EMAIL_IS_EMPTY: '',
    EMAIL_IS_NOT_VALID: '',
    PASSWORD_MISSING: '',
    PASSWORD_IS_EMPTY: '',
    PASSWORD_IS_TOO_SHORT_MIN_5: '',
    VERIFICATION_BAD_REQUEST: '',
    REFRESH_TOKEN_MISSING: '',
    REFRESH_TOKEN_IS_EMPTY: '',
};

exports.request_validation = {
    REQUEST_ID_MISSING: '',
    REQUEST_ID_IS_NOT_VALID: '',
};

exports.profile_vlidation = {
    NAME_IS_EMPTY: '',
    PHONE_IS_EMPTY: '',
    INVALID_PHONE: '',
    CITY_IS_EMPTY: '',
    PROVINCE_IS_EMPTY: '',
    ABOUT_ME_IS_EMPTY: '',
    ABOUT_ME_LENGTH: '',
    MOTTO_IS_EMPTY: '',
    MOTTO_LENGTH: '',
    BAD_REQUEST: '',
    CURRENT_PASSWORD_MISSING: '',
    CURRENT_PASSWORD_IS_EMPTY: '',
    CURRENT_PASSWORD_IS_TOO_SHORT_MIN_5: '',
    NEW_PASSWORD_MISSING: '',
    NEW_PASSWORD_IS_EMPTY: '',
    NEW_PASSWORD_IS_TOO_SHORT_MIN_5: '',
    PROFILE_IMAGE_MISSING: '',
    I_WILL_SHOW_YOU_MOST_BE_AN_ARRAY: '',
    TRAVEL_FACILITIES_MOST_BE_AN_ARRAY: '',
};

exports.rate_validation = {
    LEADER_ID_MISSING: '',
    LEADER_ID_IS_EMPTY: '',
    LEADER_ID_IS_NOT_VALID: '',
    REQUEST_ID_MISSING: '',
    REQUEST_ID_IS_EMPTY: '',
    REQUEST_ID_IS_NOT_VALID: '',
    STAR_IS_EMPTY: '',
    STAR_SHOULD_BE_NUMERIC: '',
    COMMENT_IS_EMPTY: '',
};

exports.request_validation = {
    LEADER_ID_MISSING: '',
    LEADER_ID_IS_EMPTY: '',
    LEADER_ID_IS_NOT_VALID: '',
    EXPERIENCES_MISSING: '',
    EXPERIENCES_IS_EMPTY: '',
    EXPERIENCES_MOST_BE_AN_ARRAY: '',
    REQUEST_ID_MISSING: '',
    REQUEST_ID_IS_NOT_VALID: '',
    SATISFACTION_MISSING: '',
    SATISFACTION_MALFORMED: ''
};

exports.leader_validation = {
    EXPERIENCES_MISSING: '',
    EXPERIENCES_IS_EMPTY: '',
    EXPERIENCES_MOST_BE_AN_ARRAY: '',
};