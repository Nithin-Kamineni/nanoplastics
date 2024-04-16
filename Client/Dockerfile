FROM node:14.14.0-alpine as builder

WORKDIR /usr/src/client

COPY package.json .
# COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx 
EXPOSE 3201
COPY ./nginx/aiqsar.conf /etc/nginx/conf.d/aiqsar.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
#
# COPY ./certs/devopsbyexample.pem /etc/nginx/certs/devopsbyexample.pem
# COPY ./certs/devopsbyexample-key.pem /etc/nginx/certs/devopsbyexample-key.pem
#
COPY --from=builder /usr/src/client/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]