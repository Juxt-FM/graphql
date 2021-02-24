# JUXT GraphQL Service

This component of the JUXT application serves as a GraphQL wrapper for all of the services this project provides, as well as 3rd party market APIs.

Technologies:

- Express
- Apollo
- AWS SNS
- AWS S3
- Gremlin/AWS Neptune

## Setup

1. Install yarn https://classic.yarnpkg.com/en/docs/install/#mac-stable
2. Install dependencies

```
yarn install
```

## Configuration

**Server environment**

NODE_ENV (NodeJS environment)\
PORT (server port - default is 4000)\
COOKIE_SECRET (used to sign cookies)\
PROXY_IN_USE (if your application is behind a proxy)

**Database environment**

DB_URI\
DB_USER\
DB_PASSWORD

**AWS environment**

AWS_REGION\
AWS_ACCESS_KEY_ID\
AWS_SECRET_KEY_ID

#### Nodemon (development)

rootDir/nodemon.json

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
apollo-server-testing (GraphQL integration)

```
yarn test
```
