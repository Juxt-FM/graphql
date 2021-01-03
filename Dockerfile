# Build stage: create a clean TS->JS build

FROM node:14 AS build

RUN mkdir -p /build
WORKDIR /build

COPY package.json .

RUN npm install

COPY . .

RUN npm run build


# Build the final slimmed application image

FROM node:14

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY --from=build /build/dist .

EXPOSE ${PORT}

CMD ["node", "app.js"]