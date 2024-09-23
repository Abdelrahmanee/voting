import User from "../../../db/models/user.model.js";
import { catchAsyncError } from "../../utilies/error.js";



export const getUserInfo = catchAsyncError((req, res) => {

     res.json({ message: "success" })
})

// 

export const createUser = catchAsyncError(async (req, res) => {
    const { ip } = req;
    console.log(req.ip);

    const { name, address, phone } = req.body;

    // Create new user in the database
    const newUser = new User({
        name,
        phone,
        ipAddress: ip,
        address
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
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