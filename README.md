# Hedger GraphQL Service

This component of the Hedger application serves as a GraphQL wrapper for all of the services this project provides, as well as 3rd party market APIs.

Technologies:

- Express
- Apollo
- MongoDB

## Setup

1. Install yarn https://classic.yarnpkg.com/en/docs/install/#mac-stable
2. Install dependencies

```
yarn install
```

4. Set environment variables

#### Available Variables

**Server configuration**

NODE_ENV - Nodejs environment\
PORT - Server port (default is 4000)\
COOKIE_SECRET - Used to sign cookies\
PROXY_IN_USE - If your application is behind a proxy

**Database configuration**

DB_NAME - Database name (required)\
DB_HOST - Database host (required)\
DB_PORT - Database port (required)\
DB_USER - Database username (required)\
DB_PASS - Database password (required)

#### Nodemon (development)

nodemon.js

```
{
  "env": {
    "NODE_ENV": "development",
    ...
  }
}
```

## Run the application

### Development

```
yarn start:dev
```

### Production

```
yarn start
```

## Testing

**Resources**

Jest\
mongodb-memory-server (Service integration)\
apollo-server-testing (GraphQL integration)

```
yarn test
```
