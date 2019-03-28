/********************
 * GLOBAL
 */
exports.global = {
  ERROR: 'مشکلی به وجود آمد بعدا تلاش کنید',
  NOT_FOUND: 'داده ای یافت نشد!',
};

/*********************
 * CONTROLLER
 */
exports.auth_controller = {
    USER_REGISTERED_VERIFY_EMAIL: 'ایمیل تایید از طرف تورآسو برای شما ارسال شد آن را تایید کنید',
    EMAIL_VERIFIED_NOW_LOGIN: 'ایمیل شما تایید شد اکنون می توانید وارد شوید',
    RESET_EMAIL_SENT: 'ایمیل بازیابی برای شما ارسال شد',
    RESET_PASSWORD_PAGE: 'صفحه بازیابی رمز عبور',
    PASSWORD_CHANGED: 'رمز عبور تغییر یافت',
    LOGGED_IN: 'با موفقیت وارد شدید',
    TOKEN_REFRESHED: 'DONE',
};

exports.base_controller = {
    ID_MALFORMED: 'درخواست معتبر نیست'
};

exports.pay_controller = {
    SUCCESS_FULL_PAYMENT: 'پرداخت با موفقیت انجام شد'
};

exports.profile_controller = {
    GET_PROFILE: 'صفحه پروفایل',
    PROFILE_UPDATED: 'پروفایل شما بروزرسانی شد',
    PASSWORD_UPDATED: 'رمز عبور شما با موفقیت تغییر یافت',
    PROFILE_IMAGE_UPDATED: 'عکس پروفایل شما بروزرسانی شد',
    BACKGROUND_IMAGE_UPDATED: 'عکس زمینه شما بروزرسانی شد',
    PROFILE_IMAGE_DELETED: 'عکس پروفایل شما حذف شد',
    BACKGROUND_IMAGE_DELETED: 'عکس زمینه شما حذف شد',
};

exports.rate_controller = {
    RATED: 'نظر شما ثبت شد',
};

exports.rate_controller = {
    REQUEST_SENT: 'درخواست ارسال شد',
    TOUR_LEADER_FIRST_VALIDATE: 'شما به عنوان راهنما درخواست را تایید کردید',
    TOUR_LEADER_FINAL_VALIDATE: 'شما به عنوان راهنما درخواست را تایید نهایی کردید',
    USER_FINAL_VALIDATE: 'شما به عنوان گردشگر درخواست را تایید نهایی کردید',
    USER_SATISFACTION: 'رضایت شما به عنوان گردشگر ثبت شد',
    TOUR_LEADER_SATISFACTION: 'رضایت شما به عنوان راهنما ثبت شد'
};


exports.leader_controller = {
    TOUR_LEADER_REGISTER_WAIT_UNTIL_VERIFY: 'درخواست شما برای راهنما ثبت شد نتیجه از طریق ایمیل برای شما ارسال میشود',
    TOUR_LEADER_EDITED: 'پروفایل راهنمای شما تغییر یافت',
};
/**********************
 * DAO
 */
exports.experience_dao = {
  NO_EXPERIENCE: 'چنین تجربه ای وجود ندارد',
  BAD_REQUEST: 'درخواست شما معتبر نیست',
};

exports.forgotPassword_dao = {
    NOT_FOUND_OR_ALREADY_USED: 'چنین ایمیل بازیابی ارسال نشده یا اینکه استفاده شده',
    FORGOT_PASSWORD_NOT_FOUND: 'چنین بازیابی رمز عبوری وجود ندارد',
    NOT_FOUND: 'داده ای یافت نشد',
    RESET_EMAIL_SENTl: 'ایمیل بازیابی رمز عبور ارسال شد',
};

exports.request_dao = {
    REQUEST_WITH_TOUR_LEADER_NOT_FOUND: 'چنین درخواستی وجود ندارد',
    REQUEST_NOT_FOUND: 'چنین درخواستی وجود ندارد',
    REQUEST_WITH_USER_NOT_FOUND: 'چنین درخواستی وجود ندارد',
    SATISFACTION_NOT_FOUND: 'چنین درخواستی وجود ندارد',
    SATISFACTION_ALREADY_EXISTS: 'شما رضایت خود را قبل ثبت کرده اید',
    REQUEST_NOT_FOUND_OR_RATED: 'چنین درخواستی وجود ندارد یا نظرسنجی شده است',
    NOT_FOUND_OR_PAID: 'چنین درخواستی وجود ندارد یا اینکه پرداخت شده است',
    REQUEST_WITH_FACTOR_NOT_FOUND: 'چنین درخواستی با این شماره فاکتور وجود ندارد',
};

exports.leader_dao = {
    LEADER_ALREADY_EXISTS: 'راهنما وجود داشته است',
    USER_IS_NOT_TOUR_LEADER: 'این کاربر یک راهنما نیست',
    TOUR_LEADER_NOT_FOUND_OR_NOT_VERIFIED: 'چنین راهنمایی وجود ندارد یا اینکه تایید نشده است',
    LEADER_NOT_FOUND: 'راهنما یافت نشد',
    BAD_REQUEST: 'درخواست معتبر نیست',
    SEND_SCAN_BIRTH_AND_LEADER_CARDS: 'اسکن کارت تورلیدری و شناسنامه خود را ارسال کنید',
};

exports.userRefresh_dao = {
  REFRESH_TOKEN_NOT_FOUND: 'NO_REFRESH_TOKEN',
};

exports.user_dao = {
    EMAIL_EXISTS: 'ایمیل قبلا ثبت شده است',
    NOT_FOUND_OR_ALREADY_VERIFIED: 'کاربر یافت نشد یا اینکه تایید نشده است',
    PASSWORDS_DO_NOT_MATCH: 'رمز عبور اشتباه است',
    USER_BLOCKED: 'این اکانت مسدود شد لطفا بعدا تلاش کنید',
    USER_NOT_FOUND: 'کاربر یافت نشد',
    WRONG_CURRENT_PASSWORD: 'رمز عبور اشتباه است',
};
/*******************
 * VALIDATION
 */
exports.auth_validation = {
    NAME_MISSING: 'نام را وارد کنید',
    NAME_IS_EMPTY: 'نام خالی است',
    EMAIL_MISSING: 'ایمیل را وارد کنید',
    EMAIL_IS_EMPTY: 'ایمیل خالی است',
    EMAIL_IS_NOT_VALID: 'ایمیل اشتباه است',
    PASSWORD_MISSING: 'رمز عبور را وارد کنید',
    PASSWORD_IS_EMPTY: 'رمز عبور خالی است',
    PASSWORD_IS_TOO_SHORT_MIN_5: 'رمز عبور کوتاه است حداقل ۵ کاراکتر',
    VERIFICATION_BAD_REQUEST: 'درخواست نامعتبر است',
    REFRESH_TOKEN_MISSING: 'REFRESH_TOKEN_MISSING',
    REFRESH_TOKEN_IS_EMPTY: 'REFRESH_TOKEN_IS_EMPTY',
};

exports.request_validation = {
    REQUEST_ID_MISSING: 'درخواست نامعتبر بدون درخواست',
    REQUEST_ID_IS_NOT_VALID: 'درخواست نامعتبر است',
};

exports.profile_vlidation = {
    NAME_IS_EMPTY: 'نام خالی است',
    PHONE_IS_EMPTY: 'تلفن خالی است',
    INVALID_PHONE: 'تلفن اشتباه است',
    CITY_IS_EMPTY: 'شهر خالی است',
    PROVINCE_IS_EMPTY: 'استان خالی است',
    ABOUT_ME_IS_EMPTY: 'درباره من خالی است',
    ABOUT_ME_LENGTH: 'درباره من طولانی است',
    MOTTO_IS_EMPTY: 'شعار خالی است',
    MOTTO_LENGTH: 'شعار طولانی است',
    BAD_REQUEST: 'درخواست نامعتبر است',
    CURRENT_PASSWORD_MISSING: 'رمز عبور کنونی را وارد کنید',
    CURRENT_PASSWORD_IS_EMPTY: 'رمز عبور کنونی خالی است',
    CURRENT_PASSWORD_IS_TOO_SHORT_MIN_5: 'رمز عبور باید حداقل ۵ کاراکتر باشد',
    NEW_PASSWORD_MISSING: 'رمز عبور جدید را وارد کنید',
    NEW_PASSWORD_IS_EMPTY: 'رمز عبور جدید خالی است',
    NEW_PASSWORD_IS_TOO_SHORT_MIN_5: 'رمز عبور جدید باید حداقل ۵ کاراکتر باشد',
    PROFILE_IMAGE_MISSING: 'پروفایلی وجود ندارد',
    I_WILL_SHOW_YOU_MOST_BE_AN_ARRAY: 'درخواست نامعتبر است باید ارایه باشد',
    TRAVEL_FACILITIES_MOST_BE_AN_ARRAY: 'درخواست نامعتبر است باید ارایه باشد',
};

exports.rate_validation = {
    LEADER_ID_MISSING: 'شماره راهنما وجود ندارد',
    LEADER_ID_IS_EMPTY: 'شماره راهنما خالی است',
    LEADER_ID_IS_NOT_VALID: 'شماره راهنما اشتباه است',
    REQUEST_ID_MISSING: 'شماره درخواست وجود ندارد',
    REQUEST_ID_IS_EMPTY: 'شماره درخواست خالی است',
    REQUEST_ID_IS_NOT_VALID: 'شماره درخواست اشتباه است',
    STAR_IS_EMPTY: 'ستاره خالی است',
    STAR_SHOULD_BE_NUMERIC: 'ستاره باید به صورت عدد باشد',
    COMMENT_IS_EMPTY: 'نظر خالی است',
};

exports.request_validation = {
    LEADER_ID_MISSING: 'شماره راهنما وجود ندارد',
    LEADER_ID_IS_EMPTY: 'شماره راهنما خالی است',
    LEADER_ID_IS_NOT_VALID: 'شماره راهنما اشتباه است',
    EXPERIENCES_MISSING: 'تجربه وجود ندارد',
    EXPERIENCES_IS_EMPTY: 'تجربه خالی است',
    EXPERIENCES_MOST_BE_AN_ARRAY: 'تجربه باید یک ارایه باشد',
    REQUEST_ID_MISSING: 'شماره درخواست وجود ندارد',
    REQUEST_ID_IS_NOT_VALID: 'شماره درخواست اشتباه است',
    SATISFACTION_MISSING: 'رضایت وجود ندارد',
    SATISFACTION_MALFORMED: 'رضایت اشتباه است'
};

exports.leader_validation = {
    EXPERIENCES_MISSING: 'تجربه وجود ندارد',
    EXPERIENCES_IS_EMPTY: 'تجربه خالی است',
    EXPERIENCES_MOST_BE_AN_ARRAY: 'تجربه باید یک ارایه باشد',
};
