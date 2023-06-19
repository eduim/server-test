# 🧪 Testing Exercise

## 🏕 Background

You have learned about multiple things at different levels, and now it's time to put them into practice. Specifically, we want to practice and see the following concepts:

- Setup test enviroment with docker and scripts
- Unit testing for middlewares
- Integration testing
- Authentication with cookies

In this repo, there's a RESTful API written in Typescript and protected with authentication. This API handles the resources for an app where users can create posts.

Specifically, the API handles two resources:

- Users
- Posts

There's a Postman Collection available in the folder `/postman`. You can see more details about the specific endpoints there.

As this is a complex exercise you might find interesting to follow our post to complete the exercise. [link]

## 💽 Setup base exercise

1. Duplicate both env files, and change the `DATABASE_URL,` so it points to the correct database in your machine. Remember to create them if they don't exist.
   1. `.env.default` →`.env`
   2. `.env.test.default` →`.env.test`
2. Install dependencies with `yarn`

## 📝 Task #1 – Setup enviroment

#### Jest and typescript

First is to install jest and configure it for typescript. You can follow this guide [Setup jest for typescrip](https://basarat.gitbook.io/typescript/intro-1/jest).

#### Test environment

The idea when we run the tests is to use another database instead the usual one.

- Use docker to add another db for the tests. Tip copy paste and change the name of the service along with the exposed port
- When run the tests you need to take the variables from `.env.test`, by default all the scripts will take them from `.env`. You can use `dotenv-cli` [library](https://www.npmjs.com/package/dotenv-cli). The workflow should be: Build the container, migrate the prisma schema,run the tests and remove the container. You can use the [pre and post hooks](https://www.marcusoft.net/2015/08/pre-and-post-hooks-for-npm-scripting.html)

## 📝 Task #2 – Unit tests

Tests the auth and error middlewares. The functions will recibe an HTTP request and will return a response or pass the request to the next middleware.

You need to mock the `Request`, `Reponse`, `Next` and the `Error` in the case of the error-handler. In general you need to mock inside them what you are going to use in your functions. For instance for an endpoint we'll recieve a `status` and `json`, those would be needed to mock in the `Response`. Here is a little example:

```
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction = jest.fn()


  beforeEach(() => {
    mockRequest = {
      headers: {
        cookie: 'example',
      }
    }
    mockResponse = {
      status: jest.fn()
      json: jest.fn()
    }
  })
```

> Mind the Request in the auth middleware, the `userId` is not included in the base `Request` from express, you'll need to create a custom interface extending the base one.

## 📝 Task #3 – Integration tests

In general you want to test every single endpoint, in this case to make it simple we're going to test an unprotected endpoint `POST /users` and another protected `POST /posts`.

Use [supertest](https://www.npmjs.com/package/supertest) to help you building the tests.
