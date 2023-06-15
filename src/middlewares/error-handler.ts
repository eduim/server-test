import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextFunction, Request, Response } from 'express'
import Logger from '../lib/logger'

function errorHandler(
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error.constructor === PrismaClientKnownRequestError) {
    const prismaError = error as PrismaClientKnownRequestError
    res.status(400).json(prismaCustomError(prismaError))

    return
  } else if (error.message) {
    res.status(400).json({ error: error.message })

    return
  }
  Logger.error(error)
  res.status(500)

  return
}

function prismaCustomError(
  error: PrismaClientKnownRequestError
): PrismaErrorMessage {
  let message = ''
  switch (error.code) {
    case 'P2002': {
      const target: string[] = error.meta?.target as string[]
      message = `${target.join('')} already exists`
      break
    }
    default: {
      console.error(error)
      break
    }
  }

  return { error: message }
}

export default errorHandler
