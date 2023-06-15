import errorHandler from '../error-handler'
import { Request, Response } from 'express'

describe('Error handler middleware', () => {
  const error = new Error('Test')

  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  test('handle error when error includes statusCode', async () => {
    errorHandler(error, mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: error.message })
  })
})
