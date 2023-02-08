import React, { useState } from 'react';
import './App.css';
import PhotoCamera from "./model/PhotoCamera";
import { SensorSize } from "./model/SensorSize";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import NavigationBar from './common/NavigationBar';
import { API_URL } from './index';
import AuthService from './common/AuthService';
import Cart from './model/Cart';
import io from 'socket.io-client';


function App() {
  const authService: AuthService = new AuthService();
  // All photo cameras
  const [allPhotoCameras, setAllPhotoCameras] = useState<PhotoCamera[]>([]);
  const [showAllCameras, setShowAllCameras] = useState<boolean>(false);
  // Add photo cameras
  const [newCamera, setNewCamera] = useState<PhotoCamera>(new PhotoCamera(0, '', SensorSize.FullFrame));
  const [addCameraMessage, setAddCameraMessage] = useState<string>("");
  // Delete photo cameras
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const [deleteCameraMessage, setDeleteCameraMessage] = useState<string>("");
  // Cart
  const [cartInfo, setCartInfo] = useState<string>('');
  const [cart, setCart] = useState<Cart>(new Cart('', []));
  // Websocket
  const socket = io(API_URL, { autoConnect: false });
  const [socketIsConnected, setSocketIsConnected] = useState<boolean>(false);
  configureWebSocket();

  // All photo cameras
  function handleGetAllPhotoCameras() {
    if (!socketIsConnected) {
      socket.connect();
      setSocketIsConnected(true);
    }

    fetch(`${API_URL}/cameras`)
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(cameras => {
        setAllPhotoCameras(cameras);
        setShowAllCameras(true);
      })
      .catch(error => {
        console.error(error);
        setShowAllCameras(false);
        alert("Something went wrong :(");
      });
  }

  // Add photo cameras
  function handleAddPhotoCamera() {
    if (newCamera.name.trim() === '' || !newCamera.sensorSize) {
      setAddCameraMessage("Please provide a non-empty name and sensor size.");
      return;
    }

    fetch(`${API_URL}/cameras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authService.getJwt(),
      },
      body: JSON.stringify(newCamera),
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(camera => {
        setAddCameraMessage(`Photo camera added with id: ${camera.id}`);
      })
      .catch(error => {
        console.error(error);
        setAddCameraMessage("");
        alert("Something went wrong :(");
      });
  }

  // Delete photo cameras
  function handleDeletePhotoCamera() {
    fetch(`${API_URL}/cameras/${idToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authService.getJwt(),
      }
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.text()
      })
      .then(cameraOrNull => {
        if (cameraOrNull.length) {
          setDeleteCameraMessage(`Photo camera deleted: ${cameraOrNull}`)
        } else {
          setDeleteCameraMessage(`Photo camera not found.`)
        }
      })
      .catch(error => {
        console.error(error);
        setAddCameraMessage("");
        alert("Something went wrong :(");
      });
  }

  // Cart
  function handleGetCart() {
    fetch(`${API_URL}/cart/${authService.getUsername()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authService.getJwt(),
      },
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(cart => {
        setCart(cart);
        setCartInfo(`You have ${cart.photoCameras.length} cameras in cart`);
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong :(");
      });
  }

  function handleAddToCart(camera: PhotoCamera) {
    fetch(`${API_URL}/cart/${authService.getUsername()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authService.getJwt(),
      },
      body: JSON.stringify(camera),
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.text();
      })
      .then(numberOfItems => {
        handleGetCart();
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong :(");
      });
  }

  function handleRemoveFromCart(camera: PhotoCamera) {
    fetch(`${API_URL}/cart/${authService.getUsername()}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authService.getJwt(),
      },
      body: JSON.stringify(camera),
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.text();
      })
      .then(numberOfItems => {
        handleGetCart();
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong :(");
      });
  }

  // Websocket
  function configureWebSocket() {
    socket.on('connect', () => {
      console.log('[WebSocket] connect');
      socket.emit('message', 'Photo camera store WebSocket is working!');
    });
    socket.on('connected', () => {console.log('[WebSocket] connected');});
    socket.on('connection', () => {console.log('[WebSocket] connection');});
    socket.on('connecting', () => {console.log('[WebSocket] connecting');});
    socket.on('connectEnd', () => {console.log('[WebSocket] connectEnd');});
    socket.on('disconnect', () => {console.log('[WebSocket] disconnect');});
    socket.on('disconnected', () => {console.log('[WebSocket] disconnected');});

    socket.on('write-event', (data: any) => {
      console.log(`[WebSocket] write-event ${data}`);
      handleGetAllPhotoCameras();
    });
  }


  function createPhotoCameraContainer(camera: PhotoCamera, addToCartButton: boolean) {
    return <div className={"highlight-hover2"} key={'div_for_' + camera.id.toString()}>
      <label className={"highlight-hover3 m-3 code"}>Id: {camera.id}</label>
      <label className={"highlight-hover3 m-3 code"}>Name: {camera.name}</label>
      <label className={"highlight-hover3 m-3 code"}>Sensor: {camera.sensorSize}</label>
      {
        addToCartButton
          ? <button className={"btn btn-success"} onClick={() => handleAddToCart(camera)}>Add to cart</button>
          : <button className={"btn btn-danger"} onClick={() => handleRemoveFromCart(camera)}>Remove from cart</button>
      }
    </div>;
  }

  // Render
  return (
    <div className="App">
      <NavigationBar authService={authService}/>
      <div className="App-header">
        {/* GET Photo cameras */}
        <div className={"m-2 p-5 highlight-hover w-100"}>
          <button onClick={handleGetAllPhotoCameras} className={"btn btn-outline-light big-button"}>GET all photo cameras</button>
          <div>
            {
              showAllCameras ? <label>Found {allPhotoCameras.length} photo cameras:</label> : ''
            }
            {
              allPhotoCameras.map((camera, index) => createPhotoCameraContainer(camera, true))
            }
          </div>
        </div>
        {/* ADD Photo camera */}
        <div className={"m-2 p-5 highlight-hover w-100 bg-success"}>
          <div>
            <label>Photo camera Name:</label> <br/>
            <input type='text' value={newCamera.name} onChange={e => setNewCamera(prev => ({ ...prev, name: e.target.value }))} className={'w-25 text-center'}/> <br/>
            <label>Sensor size:</label>

            <Dropdown options={[SensorSize.FullFrame, SensorSize.APSC, SensorSize.MicroFourThirds]}
                      onChange={e => setNewCamera(prev => ({ ...prev, sensorSize: e.value as SensorSize }))}
                      value={SensorSize.FullFrame}
                      className={'combobox'}/>
            <button onClick={handleAddPhotoCamera} className={"btn btn-outline-light big-button"}>ADD photo cameras</button>
            <p>{addCameraMessage}</p>
          </div>
        </div>
        {/* DELETE Photo camera */}
        <div className={"m-2 p-5 highlight-hover w-100 bg-danger"}>
          <div>
            <label>Photo camera id:</label> <br/>
            <input type='number' value={idToDelete} onChange={e => setIdToDelete(+e.target.value)} className={'w-25 text-center'}/> <br/>
            <button onClick={handleDeletePhotoCamera} className={"btn btn-outline-light big-button"}>DELETE photo cameras</button>
            <p>{deleteCameraMessage}</p>
          </div>
        </div>
        {/* Cart */}
        <div className={"m-2 p-5 highlight-hover w-100"}>
          <button onClick={handleGetCart} className={"btn btn-outline-light big-button"}>GET cart</button>
          <br/>
          <label>{cartInfo}</label>
          <div>
            {
              cart.photoCameras.map((camera, index) => createPhotoCameraContainer(camera, false))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
