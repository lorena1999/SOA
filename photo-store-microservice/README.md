# Photo camera application microservice

## Running  the microservice
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Using Docker
```bash
# see running processes
# add '-a' to see all processes
$ docker ps
____________________________________________________________________________________________________

# a) build with Dockerfile
$ docker build -t photo-store-microservice .

# run with Dockerfile
# '-d' for detached
# '-p' maps HOST_PORT:CONTAINER_PORT
# '--name' gives an arbitrary name to the image (that appears in 'docker ps -a')
$ docker run -p 3002:3002 --name photo-microservice photo-store-microservice
____________________________________________________________________________________________________

# b) build and run with docker-compose.yml
$ docker-compose up
____________________________________________________________________________________________________

# stop image
$ docker stop photo-microservice

# remove image
$ docker rm photo-microservice
```
