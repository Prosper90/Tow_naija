import { Server, Socket } from 'socket.io';
import { authenticateToken } from './auth';
import { driverHandler } from './handlers/driverHandler';
import { riderHandler } from './handlers/riderHandler';
import { DriverI, RiderI } from '../utils/interface';


export class WebSocketManager {
  private io: Server;

  constructor(io: any) {
    this.io = io;
  }

  public init(): void {
    this.io.on('connection', async (socket: Socket) => {
      try {
        // Authenticate WebSocket connection
        const user = await authenticateToken(socket.handshake.auth.token);
        console.log(`${user.role} connected: ${user._id as string}`);

        // Assign handlers based on user role
        if (user.role === 'driver') {
          driverHandler(socket, user as DriverI);
        } else if (user.role === 'rider') {
          riderHandler(socket, user as RiderI);
        }
      } catch (error) {
        console.error('Authentication failed:', error.message);
        socket.disconnect();
      }
    });
  }
}