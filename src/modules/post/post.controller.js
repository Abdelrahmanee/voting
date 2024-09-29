import Post from "../../../db/models/post.model.js";
import { AppError, catchAsyncError } from "../../utilies/error.js";




export const addPost = catchAsyncError(async (req, res, next) => {

    const uploadedImage = req.file;
    const post = new Post({
        owner: req.user._id,
        photo: uploadedImage.path,
        event: req.event._id
    })

    await post.save()
    const populatedPost = await post.populate({ path: 'owner', select: '-address' })
    res.status(201).json({ message: "post is created", data: populatedPost })
}
)
export const deletePost = catchAsyncError(async (req, res, next) => {

    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post)
        throw new AppError("Post not found", 404)

    await post.deleteOne()

    res.status(201).json({ message: "post deleted successfully" })
}
)
export const updatePost = catchAsyncError(async (req, res, next) => {


    const { postId } = req.params
    const isPostExist = await Post.findById(postId)
    if (!isPostExist)
        throw new AppError("Post not found", 404)

    const post = await Post.findByIdAndUpdate(postId, req.body, { new: true })

    res.status(201).json({ message: "post updated successfully", data: { post } })
}
)

export const getAllPosts = catchAsyncError(async (req, res, next) => {
    const { eventId } = req.params;


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ event: eventId })
        .sort({ numberOfLikes: -1 })
        .skip(skip)
        .limit(limit);

    const totalPosts = await Post.countDocuments({ event: eventId });

    const totalPages = Math.ceil(totalPosts / limit);

    if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found for this event" });
    }

    res.status(200).json({
        message: "All posts for the event",
        pagination: {
            totalPosts,
            totalPages,
            currentPage: page,
            limit,
        },
        data: posts
    });
});

export const getSpecificPost = catchAsyncError(async (req, res, next) => {
    const { postId } = req.params
    const post = await Post.findById(postId)
    if (!post)
        throw new AppError("Post not found", 404)
    res.status(201).json({ message: "success", data: post })
}
)