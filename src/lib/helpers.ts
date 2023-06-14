import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { atob } from 'buffer'
import { JWT_SECRET } from './constants'

const saltRounds = 10

const hashPassword = async (password: string) => {
  return bcrypt.hashSync(password, saltRounds)
}
const checkPassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}

const getUserFromBearerAuth = (authorization: string) => {
  const [username, password] = atob(authorization).split(':')
  return { username, password }
}

const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '90000s' })
}

const checkToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}

export {
  hashPassword,
  checkPassword,
  getUserFromBearerAuth,
  generateToken,
  checkToken,
}
