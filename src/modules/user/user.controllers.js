import axios from "axios";
import User from "../../../db/models/user.model.js";
import { USERSTATUS } from "../../utilies/enums.js";
import { AppError, catchAsyncError } from "../../utilies/error.js";
import dotenv from 'dotenv'
dotenv.config();


export const createUser = catchAsyncError(async (req, res) => {
    const ipAddress = req.ip  || req.connection.remoteAddress;

    const { name, address, phone } = req.body;
    const apiKey = process.env.IP_TOKEN_KEY;
    
    const response = await axios.get(`https://ipinfo.io/${ipAddress}?token=${apiKey}`);
    console.log(response);
    
    const { country, region, city } = response.data;

    const newUser = new User({
        name,
        phone,
        ipAddress,
        address :{
            country,
            region,
            city
        },
        isLoggedOut: false,
        status: USERSTATUS.ONLINE
    });
    await newUser.save();
    const user = await User.findById(newUser._id)
    res.status(201).json({ message: 'User created successfully', data: user, ip : ipAddress });
})

export const login = catchAsyncError(async (req, res, next) => {
    const { phone } = req.body
    console.log(req.ip);
    const user = await User.findOne({ phone, ipAddress: req.ip || req.connection.remoteAddress })
    if (!user)
        throw new AppError("please sure that the phone is correct and use the device that you registerd with", 498)
    user.isLoggedOut = false;
    user.status = USERSTATUS.ONLINE
    await user.save()
    res.status(200).json({ message: "logged in success", data: user })
})

export const userFavorites = catchAsyncError(async (req, res) => {
    const { ipAddress } = req.user;
    const { eventId } = req.body;
    const fav = await User.findOne({
        ipAddress, events: {
            $elemMatch:
                { $eq: eventId }
        }
    })
        .select('likes -_id')
        .populate({
            path: 'likes',
            options: { sort: { numberOfLikes: -1 } },
        });


    res.status(201).json({ message: 'fav activities', data: fav || [] });
})
export const userInfo = catchAsyncError(async (req, res) => {
    const userWithId = await User.findById(req.user._id)
    res.status(201).json({ message: 'User', data: userWithId });
})

export const logout = catchAsyncError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { isLoggedOut: true, status: USERSTATUS.OFFLINE })
    res.status(200).json({ message: "Logged out success" })
})
export const deleteUser = catchAsyncError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { isLoggedOut: true, status: USERSTATUS.DELETED })
    res.status(200).json({ message: "User is deleted" })
})

