# 🔑 Authentication Exercise

## 🏕 Background

You have learned about multiple things at different levels, and now it's time to put them into practice. Specifically, we want to practice the following concepts:

- Setup test enviroment
- Unit testing with middlewares
- Integration testing
- CI with github actions

In this repo, there's a RESTful API written in Typescript. This API handles the resources for an app where users can follow their favorite artists and track their announced gigs, even showing their intent to attend them.

Specifically, the API handles three resources:

- Users
- Bands
- Gigs

![auth-db](assets/README/auth-db.png)

There's a Postman Collection available in the folder `/postman`. You can see more details about the specific endpoints there.

The idea here is to **add authentication capabilities**, so users and bands can sign up and login into the system with a username and password. Also, to **implement the authorization requirements** so a user can only attend a gig or follow a band if it's authenticated, and the band can only create or modify a gig if it's authenticated and the owner of the gig.

All this while keeping the correctness of your TypeScript code and modifying existing tests to adapt to the features or creating new ones to keep the testing coverage of your code.

## 💽 Setup base exercise

1. Duplicate both env files, and change the `DATABASE_URL,` so it points to the correct database in your machine. Remember to create them if they don't exist.
   1. `.env.default` →`.env`
   2. `.env.test.default` →`.env.test`
2. Install dependencies with `yarn`
3. Check that the tests are fully functioning with the `yarn test` command. This command should run both unit and integration tests and pass. If they don't, please, ask for assistance.

> ⚠️ As you're asked to complete this task first, don't worry about the tests. Most likely, you're breaking their integrity by implementing these new features. You will modify the tests in the next task, so they pass again.

## 📝 Task #1 – Setup enviroment

`yarn add --dev jest @types/jest ts-jest`

> Install jest framework (jest)
> Install the types for jest (@types/jest)
> Install the TypeScript preprocessor for jest (ts-jest) which allows jest to transpile TypeScript on the fly and have source-map support built in.

Now we need to configure jest, for that add `jest.config.js` and add the following config

```
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
```

> We always recommend having all TypeScript files in a src folder in your project. We assume this is true and specify this using the roots option.
> The testMatch config is a glob pattern matcher for discovering .test / .spec files in ts / tsx / js format.
> The transform config just tells jest to use ts-jest for ts / tsx files.

Now we need to run the tests, add the following script to the `package.json`

```
{
  "test": "jest"
}
```

If you run it, it's going to complain, let's add a folder with a file `__test__/example.test.ts` in the src folder and make a simple test

```
const sum = (a: number, b: number) => {
  return a + b
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

```

It should run it fine now.

#### Test environment

Separate test and development environments are important for software development as they provide a controlled space for testing changes, ensure stability, facilitate collaboration, aid in issue identification, and improve the overall quality of software releases.

In this specific case we need to use another database to run all the tests without interfeer with production/development data, this approach is going to help building correctly all the tests.

First of all in the `docker-compose.yml` we can duplicate the specs of the postgres container but changing names and the port.

The file should look like this:

```
services:
  db:
    image: postgres
    restart: always
    container_name: db
    ports:
      - '5433:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydatabase
  db_test:
    image: postgres
    restart: always
    container_name: db_test
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydatabase
```

We can try it with `docker-compose up -d db_test`, this command will only run the second service defined

> note: In the command `db_test` only refers to the service name , not to the `container_name`

Duplicate the `env.test.example` and leave it as `env.test`, as you can see the difference between `.env` and this one is the port used.

When we do tests to functions is really simple to pass arguments and get the returned value. With servers and HTTP requests is a little bit more complex and emulate it's too complex in some cases, that's why we are going to use a package called `supertest` to help us.

`yarn add --dev supertest @types/supertest`

Last package we need is the `dotenv-cli` , this package is going to allow us to select the especific `.env` file we want to run. By default all scripts are going to get the `.env`.

`yarn add --dev dotenv-cli`

All right, the idea of the whole process is to execute the following actions:
1 Create and start docker test container
2 Migrate in the database the prisma schema and run the seed if apply
3 Run the tests
4 Remove the test container

This process is going to be executed in each test and the way to automate it is with scripts.

1 "docker:test": "docker-compose up -d db_test"
2 "migrate:test": "dotenv -e .env.test -- prisma migrate reset --force"
3 "test": "dotenv -e .env.test -- jest -i"
4 "docker:remove": "docker-compose down && docker rm db_test"

> \*In this case the db_test is not the service but the container name

One cool feature we can assign the order of the scripts with pre and post, so the final scripts should look like:

```
  {
    "pretest": "docker-compose up -d db_test  && dotenv -e .env.test -- prisma migrate reset --force",
    "test": "dotenv -e .env.test -- jest -i",
    "posttest": "docker rm db_test --force"
  }
```

## 📝 Task #2 – Unit tests

## 📝 Task #3 – Integration tests

## 📝 Task #4 – Github actions

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
