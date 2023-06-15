import { NextFunction, Request, Response } from 'express'

import {
  checkPassword,
  hashPassword,
  getUserFromBearerAuth,
  generateToken,
} from '../lib/helpers'

import User from '../models/usersModels'

const UsersController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, password, email } = req.body

      if (!name || !password || !email) {
        throw new Error('Name, email and password are required')
      }
      const hashedPassword = await hashPassword(password)

      const user = await User.create(name, hashedPassword, email)

      res.status(201).json(user)
    } catch (e) {
      next(e)
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const bearerHeaders = req.headers.authorization?.split(' ')[1] as string

      if (!bearerHeaders) {
        throw new Error('Authorization header is required')
      }

      //username is email
      const { username, password } = getUserFromBearerAuth(bearerHeaders)

      if (!username || !password) {
        throw new Error('Email and password are required')
      }

      const user = await User.getUserByEmail(username)

      if (!user.password) {
        throw new Error('User not found')
      }

      if (!checkPassword(password, user.password)) {
        throw new Error('Invalid password')
      }

      const token = generateToken(user.id)
      console.log(token)

      res.setHeader(
        `Set-Cookie`,
        `AUTHORIZATION=BEARER ${token}; Max-Age=90000;`
      )

      res.status(200).json(user.id)
    } catch (e) {
      next(e)
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id) {
        throw new Error('Id is required')
      }

      const user = await User.getUserById(parseInt(id))

      res.status(200).json(user)
    } catch (e) {
      next(e)
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req

      res.status(200).json(userId)
    } catch (e) {
      next(e)
    }
  },
}

export default UsersController
