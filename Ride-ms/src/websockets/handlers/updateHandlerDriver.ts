import { Socket } from 'socket.io';
import RiderService from '../../services/riderService';
import RiderRepository from '../../repositories/riderRepository';


RiderService.setRepository(new RiderRepository());

export const updateHandlerDriver = (socket: Socket, user: any) => {
  console.log(`Driver connected: ${user._id}`);
  
  socket.join(`driver:${user._id}`);

  socket.on('disconnect', () => {
    console.log(`Driver disconnected: ${user._id}`);
  });
};