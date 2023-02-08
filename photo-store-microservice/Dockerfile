FROM node:10.16.3
WORKDIR /photo-microservice
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["node", "dist/main"]