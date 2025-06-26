FROM node:lts AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM webdevops/nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /var/www/html
