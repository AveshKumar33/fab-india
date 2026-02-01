/**  website-routes.ts */
export const WEBSITE_HOME = "/"

/** Auth */
export const WEBSITE_LOGIN = "/auth/login"
export const WEBSITE_REGISTER = "/auth/register"
export const WEBSITE_FORGOT_PASSWORD = "/auth/forgot-password"
export const WEBSITE_RESET_PASSWORD = "/auth/reset-password"


/** Optional (future-proof) */
export const WEBSITE_VERIFY_EMAIL = "/auth/verify-email"
export const WEBSITE_CHANGE_PASSWORD = "/auth/change-password"
export const WEBSITE_LOGOUT = "/auth/logout"

/** Dashboard / App (when you add protected routes) */
export const WEBSITE_DASHBOARD = "/dashboard"
export const WEBSITE_PROFILE = "/profile"
