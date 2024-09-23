
import { Router } from 'express'
import { createUser, getUserInfo, userFavorites } from './user.controllers.js'
import { checkUniqueIpAddress } from './user.middelwares.js'


const userRouter = Router()


userRouter.get('/' , getUserInfo) 

userRouter
    .get('/favorites' , userFavorites)
userRouter
    .post('/create-user', checkUniqueIpAddress , createUser)

    
export default userRouter
