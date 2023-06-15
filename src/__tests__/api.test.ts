import request from 'supertest'
import app from '../app'
import { generateToken } from '../lib/helpers'

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
    console.log(response.body)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      id: 1,
      name: 'test',
      createdAt: expect.any(String),
    })
  })
})

describe('POST /posts', () => {
  test('Should create post', async () => {
    const token = generateToken(1)
    console.log(token)
    // const response = await request(app)
    //   .get('/me')
    //   .set('Cookie', [`AUTHORIZATION=BEARER ${token} ; Max-Age=90000;`])
    // expect(response.status).toBe(201)
    // expect(response.body).toEqual(1)
  })
  test('Should return error when not passed cookies', async () => {})
})
