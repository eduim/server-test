import { NextFunction, Request, Response } from 'express'
import { test, describe } from '@jest/globals'
import { generateToken } from '../../lib/helpers'
import userAuthorizationMiddleware from '../user-auth'

interface authRequest extends Request {
  userId: number
}

describe('Auth middleware', () => {
  let mockRequest: Partial<authRequest>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()

  const token = generateToken(1)

  beforeEach(() => {
    mockRequest = {
      headers: {
        cookie: `AUTHORIZATION=BEARER ${token}`,
      },
      userId: undefined,
    }
    mockResponse = {
      json: jest.fn(),
    }
  })

  test('Should pass for a valid token', async () => {
    userAuthorizationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(mockRequest.userId).toBe(1)
    expect(nextFunction).toHaveBeenCalled()
  })

  test('Should not pass for a invalid token', async () => {
    if (mockRequest.headers) {
      mockRequest.headers.cookie = `AUTHORIZATION=BEARER ${token}123`
    }

    userAuthorizationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(mockRequest.userId).toBe(undefined)
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error))
  })
})
