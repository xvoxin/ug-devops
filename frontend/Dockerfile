FROM node:alpine as builder

WORKDIR /app/webapp

COPY ./package.json .

RUN yarn install

COPY . .

RUN yarn build


FROM nginx

COPY --from=builder /app/webapp/build /usr/share/nginx/html
