
import { Router } from 'express'
import { createUser, getUserInfo } from './user.controllers.js'
import { checkUniqueIpAddress } from './user.middelwares.js'


const userRouter = Router()


userRouter.get('/' , getUserInfo) 

userRouter
    .post('/create-user', checkUniqueIpAddress , createUser)

    
export default userRouter
