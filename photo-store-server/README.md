# Photo camera application server

##  Running the server
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Using Docker
IMPORTANT: In order to communicate with external services, in `app.module.ts` the host must be provided by uncommenting the line `host: 'host.docker.internal'`.
```bash
# see running processes
# add '-a' to see all processes
$ docker ps
____________________________________________________________________________________________________

# a) build with Dockerfile
$ docker build -t photo-store-server .

# run with Dockerfile
# '-d' for detached
# '-p' maps HOST_PORT:CONTAINER_PORT
# '--name' gives an arbitrary name to the image (that appears in 'docker ps -a')
$ docker run -p 3001:3001 --name photo-server photo-store-server
____________________________________________________________________________________________________

# b) build and run with docker-compose.yml
# '--build' to rebuild
$ docker-compose up
____________________________________________________________________________________________________

# stop image
$ docker stop photo-server

# remove image
$ docker rm photo-server
```
