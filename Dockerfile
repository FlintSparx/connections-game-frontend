FROM node:20-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/nginx.conf
#COPY nginx.crt /etc/nginx/certs/nginx.crt
#COPY nginx.key /etc/nginx/certs/nginx.key
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
