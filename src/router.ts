import express from 'express'

import userAuthorizationMiddleware from './middlewares/user-auth'
import UsersController from './controllers/usersController'
import PostController from './controllers/postControllers'

const router = express.Router()
const authRouter = express.Router()

router.post('/users', UsersController.createUser)
router.get('/login', UsersController.login)

authRouter.use(userAuthorizationMiddleware)

authRouter.get('/me', UsersController.me)
authRouter.get('/users/:id', UsersController.getUserById)

authRouter.post('/posts', PostController.createPost)
authRouter.get('/posts', PostController.getPosts)

export { router, authRouter }
