# System  diagram

```mermaid
graph TD
    User([User])-.-uses-.->MySystem(My System)
    MySystem-.->EmailSystem(Email System)
    EmailSystem-.- sends -.->User
```

# Container diagram (of MySystem)

```mermaid
graph TD
    MyMobileApp-->MyWebApp
    MyWebApp-->MyAuthService
    MyWebApp-->MyService1
    MyService1-->MyService2
```

# Component diagram (of MyWebApp)

```mermaid
graph TD
    Client-->MyAuthController
    subgraph web
    MyAuthController
    MyResourceController
    end
    subgraph auth
    MyAuthService
    end
    MyAuthController-->MyAuthService
    Client-->MyResourceController
    MyResourceController-->MyService1
```

# Component diagram (of MyAuthService)

```mermaid
graph TD
    Client-->MyAuthService
    MyAuthService-->MyDatabase
```

# Code

```mermaid
classDiagram
    MyInterface<|--MyClass
    MyInterface : fun()
    MyClass : prop
    MyClass : fun()
```

```mermaid
sequenceDiagram
    A-->>B: message
    loop Every minute
        B-->>A: response
    end
 ```