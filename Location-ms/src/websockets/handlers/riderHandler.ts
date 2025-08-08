import { Socket } from 'socket.io';
import RiderService from '../../services/riderService';
import RiderRepository from '../../repositories/riderRepository';


RiderService.setRepository(new RiderRepository());

export const riderHandler = (socket: Socket, user: any) => {
  console.log(`Rider connected: ${user._id}`);

  // Listen for location updates
  socket.on('location:update', async (locationData: { latitude: number; longitude: number }) => {
    try {
      let result = await RiderService.updateLocation(user._id, locationData);
      console.log(`Rider location updated: ${JSON.stringify(locationData)}`);


      if (result?.error) {
        socket.emit('errorResponse', {
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Error updating location:', error.message);
      socket.emit('error', { message: 'Failed to update location' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Rider disconnected: ${user._id}`);
  });
};