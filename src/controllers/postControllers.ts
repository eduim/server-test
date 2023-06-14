import { NextFunction, Request, Response } from 'express'
import Post from '../models/postModels'
const PostController = {
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, text } = req.body
      const userId = req.userId as number

      const post = await Post.create(userId, title, text)
      res.status(201).json(post)
    } catch (e) {
      next(e)
    }
  },

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId as number

      const posts = await Post.findAll(userId)
      res.status(200).json(posts)
    } catch (e) {
      next(e)
    }
  },
}

export default PostController
