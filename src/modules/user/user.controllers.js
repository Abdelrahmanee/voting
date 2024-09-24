import User from "../../../db/models/user.model.js";
import { catchAsyncError } from "../../utilies/error.js";



export const getUserInfo = catchAsyncError((req, res) => {

    res.json({ message: "success" })
})

// 

export const createUser = catchAsyncError(async (req, res) => {
    const { ip } = req;

    const { name, address, phone } = req.body;

    const newUser = new User({
        name,
        phone,
        ipAddress: ip,
        address
    });
    await newUser.save();
    const user = await User.findById(newUser._id)
    res.status(201).json({ message: 'User created successfully', data: user, ip });
})

export const userFavorites = catchAsyncError(async (req, res) => {
    const { ip } = req;
    const fav = await User.findOne({ ipAddress: ip })
        .select('likes -_id')
        .populate({
            path: 'likes',
            options: { sort: { numberOfLikes: -1 } },
        });


    res.status(201).json({ message: 'fav cars', data: fav });
})
export const userInfo = catchAsyncError(async (req, res) => {
    const { ip } = req;
    const userWithIp = await User.findOne({ ip })
    const userWithId = await User.findById(req.params.id)
    res.status(201).json({ message: 'User', data: userWithIp, "UserById": userWithId });
})