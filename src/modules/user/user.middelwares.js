import User from "../../../db/models/user.model.js";
import { AppError, catchAsyncError } from "../../utilies/error.js";





export const checkUniqueIpAddress = catchAsyncError(async (req, res, next) => {
    const { ip } = req
    console.log(ip);

    const userIsExist = await User.findOne({ ipAddress: ip })
    if (userIsExist)
        throw new AppError('User already exist', 400)

    next()
})