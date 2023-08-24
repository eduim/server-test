/* removeIf(exercise) */
import request from 'supertest'
import  startServer  from '../app'
import { generateToken } from '../lib/helpers'

const app = startServer()

describe('POST /users', () => {
  test('Should create user', async () => {
    const response = await request(app).post('/users').send({
      name: 'test',
      email: 'test',
      password: 'test',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: 1,
      name: 'test',
      createdAt: expect.any(String),
    })
  })

  test('Should return error when not passed all required fields', async () => {
    const response = await request(app).post('/users').send({
      name: 'test',
      email: 'test',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Name, email and password are required',
    })
  })
})

describe('POST /posts', () => {
  test('Should create post', async () => {
    const token = generateToken(1)
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'test',
        text: 'test',
      })
      .set('Cookie', [`AUTHORIZATION=BEARER ${token}`])

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(Number),
      title: 'test',
      text: 'test',
      creaedAt: expect.any(String),
      publish: false,
      authorId: expect.any(Number),
    })
  })
})
/* endRemoveIf(exercise) */
