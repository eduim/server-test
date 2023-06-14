import { Request } from 'express'
export interface authRequest extends Request {
  userId: number
}

import * as express from 'express'
declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}
