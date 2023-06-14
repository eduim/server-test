# 🔑 Authentication Exercise

## 🏕 Background

You have learned about multiple things at different levels, and now it's time to put them into practice. Specifically, we want to practice the following concepts:

- Applied TypeScript
- Authentication & Authorization
- World-class back-end testing

In this repo, there's a RESTful API written in Typescript. This API handles the resources for an app where users can follow their favorite artists and track their announced gigs, even showing their intent to attend them.

Specifically, the API handles three resources:

- Users
- Bands
- Gigs

![auth-db](assets/README/auth-db.png)

There's a Postman Collection available in the folder `/postman`. You can see more details about the specific endpoints there.

The idea here is to **add authentication capabilities**, so users and bands can sign up and login into the system with a username and password. Also, to **implement the authorization requirements** so a user can only attend a gig or follow a band if it's authenticated, and the band can only create or modify a gig if it's authenticated and the owner of the gig.

All this while keeping the correctness of your TypeScript code and modifying existing tests to adapt to the features or creating new ones to keep the testing coverage of your code.

## 💽 Setup

1. Duplicate both env files, and change the `DATABASE_URL,` so it points to the correct database in your machine. Remember to create them if they don't exist.
   1. `.env.default` →`.env`
   2. `.env.test.default` →`.env.test`
2. Install dependencies with `yarn`
3. Check that the tests are fully functioning with the `yarn test` command. This command should run both unit and integration tests and pass. If they don't, please, ask for assistance.

## 📝 Task #1 – Setup enviroment

> ⚠️ As you're asked to complete this task first, don't worry about the tests. Most likely, you're breaking their integrity by implementing these new features. You will modify the tests in the next task, so they pass again.
>
> TL;DR Ignore the tests for this step.

### Requirements

#### Add Users Authentication

- Modify the `POST /user` endpoint, so it now accepts a `password` field. The app should create the user but now add the hashed password as a field in the database. You can use [bcrypt](https://www.npmjs.com/package/bcrypt) to hash the password.

  ✅ Using postman, ensure that the correct record is created in the database when creating a user with the user and password. It should contain the hashed password.

- Users should be able to access a `GET /login` endpoint that accepts **Basic** authentication. You should check if the password is correct by comparing both hashed versions. The endpoint should respond with a `401 Unauthorized` if the request is missing credentials.
  The endpoint should create a token; I recommend you use [JSON Web Tokens (JWT)](https://jwt.io). Add this token in the response of the API.

  ✅ Using postman, hit the endpoint with the correct user and password using _Basic Authentication_ and expect the result to give you details of the user and an auth token.

  > When testing this endpoint in Postman, check the Auth tab in the request editor. It allows you to send Basic Auth data without worrying about encoding in base64 manually.

#### Add Users authorization

- Create a middleware that unfolds the JWT in the `Authorization` header (or check for general token validation if you didn't use JWT in the previous step). This middleware should write the user's information needed in the controllers in the request (i.e., `req.user` object).

  > :point_up: Keep in mind that this middleware should only be installed in routes that expect

  - Navigate the files and get familiar with the project. It's designed using an [MVC](https://en.wikipedia.org/wiki/Model–view–controller) architecture pattern.
  - Adapt the Prisma schema, so users store the hashed password and remember to run the migrations, so your database is updated.
  - Work in the `users.controller.ts` (controller) and the `user.ts` (model) files to read the body correctly and store the data accordingly. I guess I would do the hashing in the model.

  :white_check_mark: You can check the completion of this step as you start the next one. Create the endpoint `/me`, install the middleware before it, and check that `req.user` has the correct information. Check the error case in which no token is sent, and you get a `401 Unauthorized`.

- Create a new endpoint `GET /me` that responds with the logged-in user's data.

  1. Create the new route in the `routes.ts` file and a method in the Users Controller.
  2. For this step, no method on the Model will be needed, as you can use the `findBy`.

  ✅ With postman, ensure you get the user info correctly when hitting the `GET /me` endpoint, sending the correct token in the `Authorization` header with a `Bearer` strategy.

- Modify `PUT /user/:id,` so it only allows a change in the user if it's the same user logged in. If the request tries to modify a different user, it should respond with a `403 Forbidden`.

  ✅ With postman, ensure you're not able to modify another user that the one with the correct token, receiving a `403` status in the response.

- Modify the `POST /bands/:bandId/gigs/:gigId/attend` and `unattended` endpoints so they don't need a body anymore. The user should be inferred from the token.

  ✅ With postman, ensure you can register your attendance to a gig using the token inferred by the token. Get a `201` status, then hit the `GET /me` endpoint and see how the `attending` array of the user grew. Same for removing attendance.

### Extra Credits

- Add authentication/authorization for Bands too. Bands should be able to sign-up, sign in, and create and modify gigs.

## 📝 Task #2 – Test the back-end

### Context

This project is already a testing environment set up; it works with Jest and has both unit and integration tests.

#### Unit Tests

You can find these in the `controllers/__tests__` folder. They aren't labeled by any name, but you can infer they're unit tests because they're in the folder `controllers`. They are meant to test the controllers and the controllers only, mocking anything that comes from it.

Note how they import the subject to test (`users.controller.ts`) and its dependencies (`../../models/User.ts`). In the case of the dependencies, we're mocking them (with `jest.mock(../../models/User.ts)`; this prevents the User model from talking to the DB.

On the test itself, we're mocking what the `User` model returns with `mock.mockResolvedValueOnce(…)` or `mock.mockImplementationOnce(…)` to throw the desired error.

I also created a file with utility functions that will be useful for all the tests (i.e., `../../../test/utils/generate`). Feel free to create more utility functions there.

#### Integration Tests

You can find them in the `src/__tests__` folder. Also, you can infer they're testing the entire application because they sit in the root folder.

Instead of mocking, I'm starting the entire server and running HTTP requests against it with an API client called Axios (alternative to fetch).

> ℹ️ Note when I start the server `beforeAll` the tests, I close it `afterAll` of them, just once.

These tests talk to the database directly, so any data created or modified by the tests will remain there until the database is cleaned up. Keep this in mind. Before the test suite is run, the database is reset per the migration in the `yarn test:tearup` script in the package.

### Requirements

> :white_check_mark: The check for every step is to have all the tests passed.

- Modify the existing tests (unit and integration) that are not passing due to the change in requirements
- Create **unit tests** for your new authorization middleware. Middlewares are easy to test as they only work with the req and the res objects passed as arguments.
  - Test the success case that a valid JWT token is passed and calls the next function after setting the `req.user` attribute.
  - Test the usual error cases such as
    - Unexisting token in the `Authorization` header. It should throw an error or respond with a `401`. Remember that the middleware should be installed only for these routes that need a user to authenticate.
    - Incorrect or **manipulated** JWT token provided.
- Create new **integration tests** that check the creation of a user and its login process.
  - The success case would be signing up and logging in using the same password to acquire a JWT token finally. You can also check that the password hasn't been stored raw in the database.
  - Check some error cases like:
    - Incorrect password format or missing on signup.
    - Not using the correct password at login.
    - Be creative and think about other edge cases.
