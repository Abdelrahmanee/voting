import { Router } from "express";
import { addPost, deletePost, getAllPosts, getSpecificPost, updatePost } from "./post.controller.js";
import uploadPhotoMiddleware from "../../middelwares/upload.middelware.js";



const postRouter = Router()

postRouter.get('/', getAllPosts)
postRouter.post('/add-post' , uploadPhotoMiddleware, addPost)
postRouter
    .get('/post/:id', getSpecificPost)
    .put('/post/:id', updatePost)
    .delete('/post/:id', deletePost)



export default postRouter