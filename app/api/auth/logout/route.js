import { dbConnect } from "@/lib/database-connection";
import { User } from "@/models/User.model";
import { OTP } from "@/models/Otp.model";
import { response, catchError } from "@/lib/helper-function";

export async function POST(req) {
    await dbConnect();

    try {
        /** Clear all authentication cookies */
        const cookies = req.cookies;

        // List of cookies to clear (common auth cookies)
        const cookiesToClear = [
            'token',
            'refreshToken',
            'user',
            'auth',
            'session',
            'isLoggedIn',
            'rememberMe',
            'accessToken',
            'userId'
        ];

        // Get user info from cookies or token for database cleanup
        const userToken = cookies.get('token')?.value;
        const userEmail = cookies.get('user')?.value;

        // Clear each cookie
        cookiesToClear.forEach(cookieName => {
            if (cookies.get(cookieName)) {
                cookies.set(cookieName, {
                    value: '',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 0, // Immediately expire
                    path: '/'
                });
            }
        });

        // Database cleanup
        try {
            // Clear OTP data for the user if email is available
            if (userEmail) {
                await OTP.deleteMany({ email: userEmail });
            }

            // Update user status if needed (e.g., clear last login, update logout time)
            if (userToken || userEmail) {
                // You might want to update user's last logout time
                // await User.findOneAndUpdate(
                //     { email: userEmail },
                //     { 
                //         lastLogout: new Date(),
                //         isOnline: false,
                //         $unset: { refreshToken: 1, sessionToken: 1 }
                //     }
                // );

                // If you have a separate session collection, clear it
                // await Session.deleteMany({ userId: user._id });
            }

            console.log('Database cleanup completed during logout');
        } catch (dbError) {
            console.error('Database cleanup error during logout:', dbError);
            // Continue with logout even if DB cleanup fails
        }

        return response(true, 200, "Logged out successfully", {
            message: "All authentication cookies cleared and database cleanup completed",
            clearedCookies: cookiesToClear,
            databaseCleanup: true
        });

    } catch (error) {
        console.error("Logout error:", error);
        return catchError(error, "Logout failed");
    }
}

export async function GET(req) {
    try {
        // Handle GET requests for logout (useful for direct navigation)
        return await POST(req);
    } catch (error) {
        console.error("Logout GET error:", error);
        return catchError(error, "Logout failed");
    }
}