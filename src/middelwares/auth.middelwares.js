import User from "../../db/models/user.model.js";
import { ROLES, USERSTATUS } from "../utilies/enums.js";
import { AppError, catchAsyncError } from "../utilies/error.js";




export const authenticate = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const storedIpAddress = user.ipAddress;

    const requestIpAddress = req.ip;

    if (user.status === USERSTATUS.DELETED) throw new AppError('Account is deleted', 400);
    if (storedIpAddress !== requestIpAddress) throw new AppError('Unauthorized access - IP address mismatch', 403);
    if (user.isLoggedOut) throw new AppError('login first', 400);

    req.user = user;
    next();
});

export const authorize = (roles = Object.values(ROLES)) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) return next()
        return next(new AppError('you not allowed to access this endpoin', 403))
    }
}