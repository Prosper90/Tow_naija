import { Socket } from 'socket.io';
import { DriverI } from '../../utils/interface';
import DriverService from '../../services/driverService';
import DriverRepository from '../../repositories/driverRepository';


DriverService.setRepository(new DriverRepository());

export const driverHandler = (socket: Socket, user: Partial<DriverI>) => {
  console.log(`Driver connected: ${user._id}`);

  // Listen for location updates
  socket.on('location:update', async (locationData: { latitude: number; longitude: number }) => {
    try {
      const result = await DriverService.updateLocation(user._id as string, locationData);
      console.log(`Driver location updated: ${JSON.stringify(locationData)}`);

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
    console.log(`Driver disconnected: ${user._id}`);
  });
};