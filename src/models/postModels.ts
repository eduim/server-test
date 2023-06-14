import prisma from '../lib/prisma'

class Post {
  constructor(
    public id: number,
    public title: string,
    public text: string,
    public creaedAt: Date,
    public publish: boolean,
    public authorId?: number
  ) {}

  static async create(
    authorId: number,
    title: string,
    text: string
  ): Promise<Post> {
    const { id, createdAt, publish } = await prisma.post.create({
      data: {
        author: {
          connect: {
            id: authorId,
          },
        },
        title,
        text,
      },
      include: {
        author: false,
      },
    })

    return new Post(id, title, text, createdAt, publish, authorId)
  }

  static async findAll(userId: number): Promise<Partial<Post>[]> {
    return await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: false,
      },
    })
  }
}

export default Post
