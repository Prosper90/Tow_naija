import { Server, Socket } from 'socket.io';
import { MatchService } from '../services/matchService';
import Logger from '../middleware/log';
import { authenticateToken } from './auth';

export const setupSocketHandlers = (io: Server) => {
  // Initialize MatchService with Socket.IO instance
  MatchService.initialize(io);

  io.on('connection', async (socket: Socket) => {
    try {
      
    Logger.log('info', `New connection: ${socket.id}`);
    const user = await authenticateToken(socket.handshake.auth.token);
    console.log(`${user.role} connected: ${user._id as string}`);

    socket.join(`driver:${user._id}`);

    // Handle driver connection
    // socket.on('driverConnect', (driverId: string) => {
    //   socket.join(`driver:${driverId}`);
    //   Logger.log('info', `Driver ${driverId} connected`);
    // });

    // Handle driver's response to ride request
    socket.on('rideResponse', async (data: {
      rideId: string,
      driverId: string,
      price: number,
      estimatedArrival: string
    }) => {
      try {
        const result = await MatchService.handleDriverResponse(
          data.rideId,
          data.driverId,
          {
            price: data.price,
            estimatedArrival: data.estimatedArrival
          }
        );


        if (result?.error) {
          socket.emit('rideResponseError', {
            error: result.error,
            rideId: data.rideId
          });
        }

      } catch (error) {
        Logger.log('error', 'Error handling ride response', error as Error);
      }
    });

    socket.on('disconnect', () => {
      Logger.log('info', `Disconnected: ${socket.id}`);
    });

    } catch (error) {
      console.error('Authentication failed:', error.message);
      socket.disconnect();
    }
    
  });
};