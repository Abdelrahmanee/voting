import { Router } from "express";
import { addPost, deletePost, getAllPosts, getSpecificPost, updatePost } from "./post.controller.js";
import uploadPhotoMiddleware from "../../middelwares/upload.middelware.js";
import { validate } from "../../middelwares/validation.middelware.js";
import { addPostSchema, deletePostSchema, getSpecificPostSchema, updatePostSchema } from "./post.valiadte.js";
import { authenticate, authorize } from "../../middelwares/auth.middelwares.js";
import { ROLES } from "../../utilies/enums.js";



const postRouter = Router({ mergeParams: true });  // Ensures eventId is passed

postRouter.post('/', authenticate, authorize(), getAllPosts)
postRouter.post('/add-post',
    uploadPhotoMiddleware,
    validate(addPostSchema),
    authenticate,
    authorize([ROLES.ADMIN]),
    addPost
)
postRouter
    .post('/post/:postId', validate(getSpecificPostSchema), authenticate, authorize(), getSpecificPost)
    .put('/post/:postId', validate(updatePostSchema), authenticate, authorize([ROLES.ADMIN]), updatePost)
    .delete('/post/:postId', validate(deletePostSchema), authenticate, authorize([ROLES.ADMIN]), deletePost)



export default postRouter