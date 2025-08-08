import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

function App() {
  const [rideId, setRideId] = useState('');
  const [socketRider, setSocketRider] = useState<Socket | null>(null);
  const [tokenRider, setTokenRider] = useState('');
  const [riderConnected, setRiderConnected] = useState(false);
  const [riderEmittedResult, setRiderEmittedResult] = useState<any>();
  const [riderEmittedError, setRiderEmittedError] = useState<any>();

  const [socketDriver, setSocketDriver] = useState<Socket | null>(null);
  const [tokenDrivers, setTokenDrivers] = useState('');
  const [driverConnected, setDriverConnected] = useState(false);
  const [driverEmittedResult, setDriverEmittedResult] = useState<any>();
  const [driverEmittedError, setDriverEmittedError] = useState<any>();

  const [driverId, setDriverId] = useState("");

  const [socketLocationDriver, setSocketLocationDriver] = useState<Socket | null>(null);
  const [socketLocationRider, setSocketLocationRider] = useState<Socket | null>(null);


  // Connect Location socket
  useEffect(() => {
    if(tokenDrivers) {

      const locationSocketDriver = io('http://13.49.230.10:3006', {
        auth: { token: tokenDrivers },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        timeout: 10000
      });
      setSocketLocationDriver(locationSocketDriver);
  
      locationSocketDriver.on('connect', () => {
        console.log('Connected to Location Driver WebSocket server');
      });
  
      locationSocketDriver.on('disconnect', () => {
        console.log('Disconnected from Location Driver WebSocket server');
      });
  
      locationSocketDriver.on('error', (error) => {
        console.error('Location WebSocket Driver error:', error);
      });
  
      return () => {
        locationSocketDriver.disconnect();
      };

    }

  }, [tokenDrivers]);


  useEffect(() => {
    if(tokenRider) {
    const locationSocketRider = io('http://13.49.230.10:3006', {
      auth: { token: tokenRider },
    });
    setSocketLocationRider(locationSocketRider);

    locationSocketRider.on('connect', () => {
      console.log('Connected to Location Rider WebSocket server');
    });

    locationSocketRider.on('disconnect', () => {
      console.log('Disconnected from Location Rider WebSocket server');
    });

    locationSocketRider.on('error', (error) => {
      console.error('Location Rider WebSocket error:', error);
    });

    return () => {
      locationSocketRider.disconnect();
    };
  }
  }, [tokenRider]);

  const connectDriver = (token: string) => {
    const driverSocket = io('http://13.49.230.10:3005', {
      auth: { token },
    });
    setSocketDriver(driverSocket);
    setDriverConnected(true);

    driverSocket.on('rideRequest', async (matchingData: any) => {
      try {
        console.log(
          `Received update for driver on ride match: ${JSON.stringify(matchingData)}`
        );
        setDriverEmittedResult(matchingData);
      } catch (error) {
        console.error('Error updating Matching Driver:', error);
        setDriverEmittedError(error);
      }
    });

    
    driverSocket.on('rideAccepted', async (matchingData: any) => {
      try {
        console.log(
          `Received update for driver on rider descision: ${JSON.stringify(matchingData)}`
        );
        setDriverEmittedResult(matchingData);
      } catch (error) {
        console.error('Error Getting rider response:', error);
        setDriverEmittedError(error);
      }
    });

    driverSocket.on('rideResponseError', async (errorData: any) => {
      try {
        console.log(
          `Received Error for driver on ride responding: ${JSON.stringify(errorData)}`
        );
      } catch (error) {
        console.error('Error updating Matching Driver:', error);
      }
    });

    driverSocket.on('disconnect', () => {
      console.log('Driver socket disconnected');
      setDriverConnected(false);
    });
  };

  const connectRider = (token: string) => {
    const riderSocket = io('http://13.49.230.10:3003', {
      auth: { token },
    });
    setSocketRider(riderSocket);
    setRiderConnected(true);

    riderSocket.on('rideRequestResponse', async (responseData: any) => {
      try {
        console.log(
          `Received update for rider on ride match: ${JSON.stringify(responseData)}`
        );
        setRiderEmittedResult(responseData);
      } catch (error) {
        console.error('Error updating Matching Rider:', error);
        setRiderEmittedError(error);
      }
    });

    riderSocket.on('disconnect', () => {
      console.log('Rider socket disconnected');
      setRiderConnected(false);
    });
  };

  const sendLocation = (type : string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Sending location: Latitude ${latitude}, Longitude ${longitude}`);
          if(type === "driver") {
            socketLocationDriver?.emit('location:update', { latitude, longitude });
          } else {
            socketLocationRider?.emit('location:update', { latitude, longitude });
          }
        },
        (error) => {
          console.error('Error fetching location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const sendResponse = () => {
    const values = {
      rideId,
      driverId: driverId,
      price: 5000,
      estimatedArrival: '20',
    };
    socketDriver?.emit('rideResponse', values);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      {/* Driver */}
      <div>
        <h1>Driver</h1>
        {driverConnected ? (
          <>
            <div>
              <input
                type="text"
                placeholder="Enter Ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
              />
                            <input
                type="text"
                placeholder="Enter DriverId"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={sendResponse}>Send Driver Response</button>
              <button onClick={() => sendLocation("driver")}>Send Location</button>
            </div>
          </>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter Driver Token"
              value={tokenDrivers}
              onChange={(e) => setTokenDrivers(e.target.value)}
            />
            <button onClick={() => connectDriver(tokenDrivers)}>Connect Driver</button>
          </div>
        )}
      </div>

      {/* Rider */}
      <div>
        <h1>Rider</h1>
        {riderConnected ? (
          <>
            <div>
              <input
                type="text"
                placeholder="Enter Ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* <button onClick={sendResponse}>Send Rider Response</button> */}
              <button onClick={() => sendLocation("rider")}>Send Location</button>
            </div>
          </>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter Rider Token"
              value={tokenRider}
              onChange={(e) => setTokenRider(e.target.value)}
            />
            <button onClick={() => connectRider(tokenRider)}>Connect Rider</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;