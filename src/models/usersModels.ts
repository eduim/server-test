import prisma from '../lib/prisma'

class User {
  constructor(
    public id: number,
    public name: string,
    public createdAt: Date,
    public password?: string
  ) {}

  static async create(
    name: string,
    password: string,
    email: string
  ): Promise<User> {
    const { id, createdAt } = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    return new User(id, name, createdAt)
  }

  static async getUserById(id: number): Promise<User> {
    const { name, createdAt } = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return new User(id, name, createdAt)
  }

  static async getUserByEmail(email: string): Promise<User> {
    const { id, name, password, createdAt } =
      await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      })

    return new User(id, name, createdAt, password)
  }
}

export default User
