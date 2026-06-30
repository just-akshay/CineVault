# Stage 1: Build the Angular app
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the built files from the build stage
COPY --from=build /app/dist/cinevault-ui /usr/share/nginx/html
EXPOSE 80