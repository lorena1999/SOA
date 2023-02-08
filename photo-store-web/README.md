# Photo camera application web client

##  Running the app
```bash
$ npm start
```
open in browser at `http://localhost:3000`

## Using Docker
```bash
# see running processes
# add '-a' to see all processes
$ docker ps
____________________________________________________________________________________________________

# a) build with Dockerfile
$ docker build -t photo-store-web .

# run with Dockerfile
# '-d' for detached
# '-p' maps HOST_PORT:CONTAINER_PORT
# '--name' gives an arbitrary name to the image (that appears in 'docker ps -a')
$ docker run -p 3000:3000 --name photo-web photo-store-web
____________________________________________________________________________________________________

# b) build and run with docker-compose.yml
$ docker-compose up
____________________________________________________________________________________________________

# stop image
$ docker stop photo-web

# remove image
$ docker rm photo-web
```
