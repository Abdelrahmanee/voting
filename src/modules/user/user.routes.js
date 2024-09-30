
import { Router } from 'express'
import { createUser, deleteUser, login, logout, userFavorites, userInfo } from './user.controllers.js'
import { checkUniqueIpAddress, checkUniquePhone } from './user.middelwares.js'
import { authenticate, authorize } from '../../middelwares/auth.middelwares.js'
import { validate } from '../../middelwares/validation.middelware.js'
import { createUserSchema, loginSchema, userInfoSchema } from './user.validate.js'


const userRouter = Router()




userRouter.post('/create-user', validate(createUserSchema) ,  checkUniquePhone ,checkUniqueIpAddress ,createUser)
userRouter.post('/login', validate(loginSchema), login)
userRouter.post('/userInfo' , validate(userInfoSchema),authenticate , authorize() , userInfo)

userRouter.patch('/logout',authenticate , authorize() , logout)
userRouter.patch('/delete-user',authenticate , authorize() , deleteUser)

userRouter.post('/favorites', authenticate, authorize(), userFavorites);

export default userRouter
