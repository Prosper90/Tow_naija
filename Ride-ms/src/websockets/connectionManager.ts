import { Server, Socket } from 'socket.io';
import { authenticateToken } from './auth';
import { DriverI, RiderI } from '../utils/interface';
import { updateHandlerRider } from './handlers/updateHandlerRider';
import { updateHandlerDriver } from './handlers/updateHandlerDriver';
import DriverService from '../services/driverService';
import RideService from '../services/rideService';
import RideRepository from '../repositories/rideRepository';
import DriverRepository from '../repositories/driverRepository';
import RiderService from '../services/riderService';
import RiderRepository from '../repositories/riderRepository';



RideService.setRepository(new RideRepository());
RiderService.setRepository(new RiderRepository());
DriverService.setRepository(new DriverRepository());

export class WebSocketManager {
  private io: Server;
 
  private indexing: Map<string, Array<{
    id: number;
    senderId: string;
    message: string;
    timestamp: string;
  }>> = new Map();

  constructor(io: any) {
    this.io = io;
  }


  // Helper function to flatten nested messages
  private flattenMessage(message: any): any {
    // If the message has numeric keys (0, 1, 2, etc.), extract those values
    const numericKeys = Object.keys(message).filter(key => !isNaN(Number(key)));
    
    if (numericKeys.length > 0) {
      // Return the nested messages
      return numericKeys.map(key => message[key]);
    }
    
    // If it's already a flat message, return it as a single-element array
    if (message.message && message.senderId) {
      return [message];
    }
    
    return [];
  }

  public init(): void {
    this.io.on('connection', async (socket: Socket) => {
      try {
        // Authenticate WebSocket connection
        const user = await authenticateToken(socket.handshake.auth.token);
        let currentRideId: string | null = null;
        // console.log(`${user.role} connected: ${user._id as string}`);

          if(user.role === "rider") {
            updateHandlerRider(socket, user as RiderI);
          } else if(user.role === "driver") {
            updateHandlerDriver(socket, user as DriverI);
          }

          // Join rider or driver to a room based on rideId
          socket.on('join_room', ({ rideId }: { rideId: string }) => {
            // console.log(`${user.role} ${user._id} joined room: ${rideId}`);
            currentRideId = rideId;
            socket.join(`ride:${rideId}`);
          });
        
          

        // Handle chat messages within the room
        socket.on('chat_message', ({ rideId, message }: { rideId: string; message: string }) => {
          // console.log(`Message in ride ${rideId} from ${user._id}: ${message}`);

          // Save message to the map
          if (!this.indexing.has(rideId)) {
            this.indexing.set(rideId, []);
          }

          const rideMessages = this.indexing.get(rideId)!;

          const chatMessage = {
            id: rideMessages.length === 0 ? 1 : rideMessages[rideMessages.length - 1].id + 1,
            senderId: user._id as string,
            message,
            timestamp: new Date().toISOString(),
          };
    
          rideMessages.push(chatMessage);


          socket.to(`ride:${rideId}`).emit('chat_message', chatMessage);
        });

        socket.on('disconnect', () => {
          if (currentRideId) {
            // Clear messages for this specific ride
            this.indexing.delete(currentRideId);
            console.log(`Cleared messages for ride: ${currentRideId}`);
          }
        });

        //emit driver and rider location
        socket.on("getlocation", async ({rideId}: {rideId: string}) => {

          //find ride
          const ride = await RideService.getRideDetails(rideId);
          // console.log(ride, "the gotten ride", rideId);
          //find driver
          const driverLocation = await DriverService.GetLocation(ride.driverId as string);
          //find rider
          const riderLocation = await RiderService.GetLocation(ride.riderId as string);

          if(ride.status === "Matched" || ride.status === "DriverArrived") {
            console.log("We have gotten here oooo");
            
              socket.emit('locations', {
                rider: riderLocation,
                driver: driverLocation
              })
              console.log("emitted, sincerely");
              
            } else if(ride.status === "InProgress") {
              socket.emit('locations', {
                driver: driverLocation
              })
            }

        })


      } catch (error) {
        console.error('Authentication failed:', error.message);
        socket.disconnect();
      }
    });
  }
}