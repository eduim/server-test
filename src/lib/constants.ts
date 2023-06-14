import dotenv from 'dotenv'

dotenv.config()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined')
}

if (!process.env.PORT) {
  throw new Error('PORT must be defined')
}

const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT

export { JWT_SECRET, PORT }
