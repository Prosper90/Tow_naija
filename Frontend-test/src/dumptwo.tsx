import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, MapPin, Send } from 'lucide-react';

const App = () => {
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
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{
    senderId: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [locations, setLocations] = useState<{
    rider?: { latitude: number; longitude: number };
    driver?: { latitude: number; longitude: number };
  }>({});

  // Connect sockets with existing logic...
  const connectDriver = (token: string) => {
    const driverSocket = io('http://13.49.230.10:3005', {
      auth: { token },
    });
    setSocketDriver(driverSocket);
    setDriverConnected(true);

    // Existing driver socket events...

    driverSocket.on('chat_message', (messageData) => {
      setChatMessages(prev => [...prev, messageData]);
    });

    driverSocket.on('locations', (locationData) => {
      setLocations(locationData);
    });

    driverSocket.emit('join_room', { rideId });

    return () => {
      driverSocket.disconnect();
    };
  };

  const connectRider = (token: string) => {
    const riderSocket = io('http://13.49.230.10:3003', {
      auth: { token },
    });
    setSocketRider(riderSocket);
    setRiderConnected(true);

    // Existing rider socket events...

    riderSocket.on('chat_message', (messageData) => {
      setChatMessages(prev => [...prev, messageData]);
    });

    riderSocket.on('locations', (locationData) => {
      setLocations(locationData);
    });

    riderSocket.emit('join_room', { rideId });

    return () => {
      riderSocket.disconnect();
    };
  };

  // Set up location polling
  useEffect(() => {
    let intervalId: any;
    
    if ((driverConnected || riderConnected) && rideId) {
      const socket = driverConnected ? socketDriver : socketRider;
      
      intervalId = setInterval(() => {
        socket?.emit('getlocation', { rideId });
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [driverConnected, riderConnected, rideId]);

  const sendMessage = () => {
    const socket = driverConnected ? socketDriver : socketRider;
    if (message.trim() && socket && rideId) {
      socket.emit('chat_message', { rideId, message: message.trim() });
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-8">
        {/* Driver Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Driver</h2>
          {driverConnected ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Enter Driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Driver Token"
                value={tokenDrivers}
                onChange={(e) => setTokenDrivers(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button 
                onClick={() => connectDriver(tokenDrivers)}
                className="w-full p-2 bg-blue-500 text-white rounded"
              >
                Connect Driver
              </button>
            </div>
          )}
        </div>

        {/* Rider Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Rider</h2>
          {riderConnected ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Ride ID"
                value={rideId}
                onChange={(e) => setRideId(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Rider Token"
                value={tokenRider}
                onChange={(e) => setTokenRider(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button 
                onClick={() => connectRider(tokenRider)}
                className="w-full p-2 bg-green-500 text-white rounded"
              >
                Connect Rider
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat and Location Section */}
      {(driverConnected || riderConnected) && rideId && (
        <div className="mt-8 grid grid-cols-2 gap-8">
          {/* Chat Section */}
          <div className="border rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Chat</h3>
            </div>
            <div className="h-64 overflow-y-auto mb-4 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-2 bg-gray-100 rounded">
                  <div className="text-sm text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                  <div>{msg.message}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className="border rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Locations</h3>
            </div>
            <div className="space-y-4">
              {locations.driver && (
                <div>
                  <h4 className="font-medium">Driver Location:</h4>
                  <p>Lat: {locations.driver.latitude}</p>
                  <p>Long: {locations.driver.longitude}</p>
                </div>
              )}
              {locations.rider && (
                <div>
                  <h4 className="font-medium">Rider Location:</h4>
                  <p>Lat: {locations.rider.latitude}</p>
                  <p>Long: {locations.rider.longitude}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;