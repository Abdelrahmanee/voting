
import { Router } from 'express'
import { createUser, getUserInfo, userFavorites, userInfo } from './user.controllers.js'
import { checkUniqueIpAddress } from './user.middelwares.js'


const userRouter = Router()


userRouter.get('/', getUserInfo)

userRouter.get('/favorites', userFavorites)

userRouter.post('/create-user', checkUniqueIpAddress, createUser)
userRouter.get('/userInfo/:id', userInfo)


export default userRouter
