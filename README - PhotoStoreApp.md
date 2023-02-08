# Photo store application

## Technologies
- React Web Application _(application 1)_
- NestJS HTTP Server _(application 2)_
- NestJS Microservice _(application 3)_
- JWT authentication
- Google Cloud Firestore
- Socket.IO
- Docker

## Service-Oriented Architecture patterns
- REST services
- Microservices architecture
- JWT authentication and access
- Database as a Service (Google Cloud Firestore)
- Server-side notifications (Socket.IO WebSocket)

## Functionalities
- view all photo cameras in the store
- login _(hardcoded user 'Andrei' and password 'parola')_
- add photo camera
- delete photo camera
- view cart
- add photo camera to cart
- delete photo camera from cart<br/>
_Note: Only the first 2 functionalities are public. For the others, the user must be authenticated._

## Run the applications
Run all the 3 applications with `npm start` and navigate to `http://localhost:3000`.<br/>
Note: The server can be started in Docker with `docker-compose up`. See individual project's readme files for details.

## API
### React Web Application
Just navigate to `http://localhost:3000`.

### NestJS HTTP Server
REST API url: `http://localhost:3001`
- GET `/` and `/home` returns a basic welcome HTML page, respectively the json `{title: 'Photo camera store'}` 
- GET `/cameras` returns a `PhotoCamera[]` array
- POST `/cameras` with a `PhotoCamera` body adds the camera into the store and returns the created `PhotoCamera` (it will have an ID associated)
- DELETE `/cameras/:id` deletes the camera from the store and returns the deleted `PhotoCamera`
- POST `/login` with a `User` body authenticates the user and returns a JWT like `{"jwt": "Bearer abc123}`
- GET `/cart/:username` returns the user's `Cart`
- POST `/cart/:username` with a `PhotoCamera` body adds the camera to user's cart and returns the new `Cart`
- DELETE `/cart/:username` with a `PhotoCamera` body deletes the camera from user's cart (by ID) and returns the new `Cart`

**PhotoCamera**: object `{id: number; name: string; sensorSize: SensorSize;}`<br/>
**SensorSize**: enum `[Fullframe, APSC, MicroFourThirds]`<br/>
**User**: object `{id: number; username: string; password: string;}`<br/>
**Cart**: object `{username: string; photoCameras: PhotoCamera[];}`<br/>

## NestJS Microservice
Running on TCP `127.0.0.1:3002`
- Message `{ cmd: 'get-all' }` returns a `PhotoCamera[]` array
- Message `{ cmd: 'add' }` with a `PhotoCamera` as data adds the camera into the store and returns the created `PhotoCamera` (it will have an ID associated)
- Message `{ cmd: 'delete' }` with a `number` as data deletes the camera from the store and returns the deleted `PhotoCamera`
- Event `'read-event'` logs in console
- Event `'write-event'` logs in console

## Diagrams

Level 1:
### System diagram
```mermaid
graph TD
    User([User])-.-uses-.->WebApplication(React Web Application)
    WebApplication-.->HttpServer(NestJS HTTP Server)
    HttpServer-.->Microservice(NestJS Microservice)
    HttpServer-.->GoogleCloudFirestore(Google Cloud Firestore)
    HttpServer-.-sends-.->WebApplication
```

Level 2:
### Container diagram
```mermaid
graph TD
    WebApplication-->HttpServer
    HttpServer-->Microservice
    HttpServer-->GoogleCloudFirestore
```

Level 3:
### Component diagram (of React Web Application)
```mermaid
graph TD
    Client-->App
    Client-->AuthService
    App-->PhotoCameraController
    App-->FirebaseCartController
    AuthService-->AppController
    subgraph web
        App
        AuthService
    end
    subgraph HTTP Server
        AppController
        PhotoCameraController
        FirebaseCartController
    end
```

### Component diagram (of NestJS HTTP Server)
```mermaid
graph TD
    Client-->AppController
    Client-->PhotoCameraController
    Client-->FirebaseCartController
    PhotoCameraController-->NestJsMicroservice
    FirebaseCartController-->GoogleCloudFirestore
    AppController-->AuthService
    AuthService-->UsersService
    AuthService-->JwtService
    subgraph controllers
        AppController
        PhotoCameraController
        FirebaseCartController
    end
    subgraph Users
        AuthService
        UsersService
        JwtService
    end
    subgraph Photo Cameras
       NestJsMicroservice 
    end
    subgraph Cart
        GoogleCloudFirestore
    end
```

### Component diagram (of NestJS Microservice)
```mermaid
graph TD
    Client-->AppController
    AppController-->PhotoCameraService
    subgraph controllers
        AppController
    end
    subgraph services
        PhotoCameraService
    end
```

Level 4:
### Code diagram
Node: Classes of _NestJS Microservice_ are suffixed with `_MICRO`, _NestJS HTTP Server_ with `_SERVER` and _React Web Application_ with `_WEB`.
```mermaid
classDiagram
NestJS Microservice
    class PhotoCamera {
        + id: number
        + name: string
        + sensorSize: SensorSize
        + PhotoCamera()
    }
    class SensorSize
        SensorSize:FullFrame
        SensorSize:APSC
        SensorSize:MicroFourThirds
    PhotoCamera *-- SensorSize
    
    class PhotoCameraService_MICRO {
        - lastId: number
        - photoCameras: PhotoCamera[]
        + getAll():
        + add()
        + delete()
     }
     PhotoCameraService_MICRO --> PhotoCamera
     
     class AppController_MICRO {
        - photoCameraService: PhotoCameraService_MICRO
        + getPhotoCameras()
        + addPhotoCamera()
        + deletePhotoCamera()
        + handleReadEvent()
        + handleWriteEvent()
     }
    AppController_MICRO --> PhotoCameraService_MICRO
    
NestJS HTTP Server
    class Cart {
        + username: string
        + photoCameras: PhotoCamera[]
    }
    Cart *-- PhotoCamera
    
    class WebsocketGateway_SERVER {
        - wss: Server
        + sendWriteEvent()
        + handleEvent()
    }
    WebsocketGateway_SERVER<-->SocketIo
    
    class PhotoCameraController_SERVER {
        - client: ClientProxy
        + mainPage()
        + getPhotoCameras()
        + addPhotoCamera()
        + deletePhotoCamera()
    }
    PhotoCameraController_SERVER --> PhotoCamera
    PhotoCameraController_SERVER --> ClientProxy
    PhotoCameraController_SERVER --> WebsocketGateway_SERVER
    ClientProxy --> AppController_MICRO
    
    class FirebaseCartController_SERVER {
        - db: Firestore
        + getCart()
        + addToCart()
        + removeFromCart()
    }
    FirebaseCartController_SERVER --> PhotoCamera
    FirebaseCartController_SERVER --> Cart
    FirebaseCartController_SERVER --> Firestore
    
    class User {
        + id: number
        + username: string
        + password: string
        + User()
    }
    
    class UserService_SERVER {
        - users: User[]
        + findOne()
    }
    UserService_SERVER --> User
    
    class AuthService_SERVER {
        - usersService: UserService_SERVER
        - jwtService: JwtService
        + login()
        + validateUser()
    }
    AuthService_SERVER --> UserService_SERVER
    AuthService_SERVER --> JwtService
    
    class AppController_SERVER {
        - authService: AuthService_SERVER
        + login()
    }
    AppController_SERVER --> AuthService_SERVER
    
React Web Application
    class AuthService_WEB {
        + setLoggedUser()
        + getUsername()
        + getJwt()
    }
    AuthService_WEB --> AppController_SERVER
    
    class NavigationBar_WEB {
        - authService: AuthService_WEB
        Login()
        Logout()
    }
    NavigationBar_WEB --> AuthService_WEB
    
    class App_WEB {
        GetAllPhotoCameras()
        AddPhotoCameras()
        DeletePhotoCamera()
        GetCart()
        AddToCart()
        RemoveFromCart()
    }
    App_WEB --> PhotoCamera
    App_WEB --> SensorSize
    App_WEB *-- NavigationBar_WEB
    App_WEB --> AuthService_WEB
    App_WEB --> PhotoCameraController_SERVER
    App_WEB --> FirebaseCartController_SERVER
    App_WEB <--> SocketIo
```