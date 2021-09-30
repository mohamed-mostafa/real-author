FROM node:12.22 AS builder
ADD package*.json /tmp/
WORKDIR /tmp
RUN npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app
FROM node:12.22-slim
COPY . /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000
CMD [ "npm", "start"]
