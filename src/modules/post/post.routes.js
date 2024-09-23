import { Router } from "express";
import { addPost, deletePost, getAllPosts, getSpecificPost, updatePost } from "./post.controller.js";
import uploadPhotoMiddleware from "../../middelwares/upload.middelware.js";
import { validate } from "../../middelwares/validation.middelware.js";
import { addPostSchema, deletePostSchema, getSpecificPostSchema, updatePostSchema } from "./post.valiadte.js";



const postRouter = Router()

postRouter.get('/', getAllPosts)
postRouter.post('/add-post' , uploadPhotoMiddleware,validate(addPostSchema), addPost)
postRouter
    .get('/post/:id', validate(getSpecificPostSchema), getSpecificPost)
    .put('/post/:id', validate(updatePostSchema), updatePost)
    .delete('/post/:id', validate(deletePostSchema), deletePost)



export default postRouter