




import { Router } from "express"
import userRouter from "../modules/user/user.routes.js"
// import postRouter from "../modules/post/post.routes.js"
import eventRouter from "../modules/event/event.routes.js"

const v1_router = Router()

v1_router.use('/users', userRouter)
// v1_router.use('/posts', postRouter)
v1_router.use('/events', eventRouter)


export default v1_router