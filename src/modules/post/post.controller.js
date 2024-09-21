import Post from "../../../db/models/post.model.js";
import { catchAsyncError } from "../../utilies/error.js";




export const addPost = catchAsyncError(async (req, res, next) => {

    const {owner} = req.body
    const uploadedImage = req.file;
    console.log(uploadedImage);
    

    const post = await Post.create({owner , photo : uploadedImage.path})

    res.status(201).json({ message: "post is created", data:  post  })
}
)
export const deletePost = catchAsyncError(async (req, res, next) => {

    const { id: postId } = req.params

    const post = await Post.findByIdAndDelete(postId)

    res.status(201).json({ message: "post deleted successfully", data: { post } })
}
)
export const updatePost = catchAsyncError(async (req, res, next) => {

    const { id: postId } = req.params

    const post = await Post.findByIdAndUpdate(postId, req.body, { new: true })

    res.status(201).json({ message: "post updated successfully", data: { post } })
}
)
export const getAllPosts = catchAsyncError(async (req, res, next) => {

    const posts = await Post.find()

    res.status(201).json({ message: "All posts", data: { posts } })
}
)
export const getSpecificPost = catchAsyncError(async (req, res, next) => {
    const { id: postId } = req.params
    const post = await Post.findById(postId)

    res.status(201).json({ message: "success", data: { post } })
}
)