import { Socket } from 'socket.io';
import RiderService from '../../services/riderService';
import RiderRepository from '../../repositories/riderRepository';


RiderService.setRepository(new RiderRepository());

export const updateHandlerRider = (socket: Socket, user: any) => {
  console.log(`Rider connected: ${user._id}`);
  
  socket.join(`rider:${user._id}`);


  socket.on('disconnect', () => {
    console.log(`Rider disconnected: ${user._id}`);
  });
};