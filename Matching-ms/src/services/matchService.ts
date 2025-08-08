import { Server, Socket } from 'socket.io';
import { RideRequestEvent, DriverResponse } from '../utils/interface';
import Logger from '../middleware/log';
import DriverRepository from '../repositories/driverRepository';
import { sendEventProducer } from '../consumers/sendEventProducer';
import RideRepository from '../repositories/rideRepository';
import RideService from './rideService';
import DriverService from './driverService';

const driverRepoitory = new DriverRepository();
RideService.setRepository(new RideRepository());
DriverService.setRepository(new DriverRepository());

export class MatchService {
  private static io: Server;
  private static activeRequests = new Map<string, NodeJS.Timeout>();
  private static driverResponses = new Map<string, {
    riderId: string,
    responses: DriverResponse[]
  }>();
  
  static initialize(socketIo: Server) {
    this.io = socketIo;
  }
  
  /**
   * 
   * @param event 
   * @returns 
   */
  static async findMatch(event: RideRequestEvent) {
    try {
      
      // Find nearby drivers using repository
      const nearbyDrivers = await driverRepoitory.findNearbyDrivers(event.pickupLocation);

      if (nearbyDrivers.length === 0) {
        await this.sendNoDriversMatchResponse(event.rideId, event.rider);
        return;
      }

      // Initialize responses collection with riderId
      this.driverResponses.set(event.rideId, {
        riderId: event.rider,
        responses: []
      });


      //find active rides from the ride service
      const activeRides = await RideRepository.getActiveRides()

      // Filter out drivers who are already on active rides
      const filteredDrivers = nearbyDrivers.filter((driver) => {
        // Check if this driver is NOT in any active ride
        return !activeRides.some(ride => ride.driverId?.toString() === driver._id?.toString());
      });


      if (filteredDrivers.length === 0) {
        await this.sendNoDriversMatchResponse(event.rideId, event.rider);
        //fail the ride
        await RideService.updateRide(event.rideId, {status: "Failed", paymentStatus: "Failed"});
        return;
      }

      const shuffledDrivers = filteredDrivers.sort(() => Math.random() - 0.5);
      const selectedDrivers = shuffledDrivers.slice(0, 5);

      // Emit ride request to nearby drivers
      selectedDrivers.forEach(driver => {
        this.io.to(`driver:${driver._id}`).emit('rideRequest', {
          rideId: event.rideId,
          rider: event.rider,
          pickupLocation: event.pickupLocation,
          dropoffLocation: event.dropoffLocation,
          towInfo: event.towInfo
        });
      });

      // Set timeout for collecting responses
      const timeout = setTimeout(
        () => this.handleMatchingTimeout(event.rideId),
        420000 // 50 seconds timeout
      );
      
      this.activeRequests.set(event.rideId, timeout);

    } catch (error) {
      Logger.log('error', 'Error in findMatch', error as Error);
      throw error;
    }
  }


  /**
   * 
   * @param event 
   * @returns 
   */
  static async NotifyDriverOfAcceptedRequest(event: RideRequestEvent) {
    try {

        this.io.to(`driver:${event.driver}`).emit('rideAccepted', {
          rideId: event.rideId,
          rider: event.rider,
          message: "Rider accepeted this request"
        });

        const rideData = this.driverResponses.get(event.rideId);
        if (!rideData) return { error: 'Ride not found' };

        // Cleanup and Free the drivers not accepted
        this.driverResponses.delete(event.rideId);
        this.activeRequests.delete(event.rideId);
    } catch (error) {
      Logger.log('error', 'Error in findMatch', error as Error);
      throw error;
    }
  }

  /**
   * 
   * @param rideId 
   * @param driverId 
   * @param response 
   * @returns 
   */
  static async handleDriverResponse(rideId: string, driverId: string, response: {price: number, estimatedArrival: string}) {
    const rideData = this.driverResponses.get(rideId);
    
    if (!rideData) return { error: 'Ride not found' };


    //make sure the driverId matches someone a driver specifically
    const foundDriver = await DriverService.getDriver(driverId);
    if(!foundDriver) {
      return { error: 'Driver with that id not found' };
    }


    //make sure driver cannot respond to the same request twice
    const driverResponded = rideData.responses.find((data) => data.driverId === driverId);
    if(driverResponded) {
      return {error: "Already responded to ride", rideId}
    }

    //check if driver has enough balance to respond
    if(foundDriver.balance === 0) {
      return {
        error: 'Insufficient balance',
        rideId
      };
    }

    const subtractedPercent = foundDriver.balance * 15/100;

    if(subtractedPercent <= 0) {
      return {
        error: 'Current balance cannot take this ride top up',
        rideId
      };
    } 

    //since a driver responded, update the ride status to matching
    if(rideData.responses.length === 0) {
     const updateRide = await RideService.updateRide(rideId, {'status': 'Matching'});
      if(!updateRide) {
        return {
          error: 'Issues updating ride',
          rideId
        };
      }
    }


    rideData.responses.push({
      rideId,
      driverId,
      driverName: `${foundDriver.lastName} ${foundDriver.firstName}`,
      price: response.price,
      estimatedArrival: response.estimatedArrival
    });
    this.driverResponses.set(rideId, rideData);
    // Send updated matches back to ride-ms
    await this.sendMatchResponse(rideId, rideData.responses, rideData.riderId);
    return { success: true };
  }

  /**
   * 
   * @param rideId 
   * @returns 
   */
  private static async handleMatchingTimeout(rideId: string) {
    const rideData = this.driverResponses.get(rideId);
    if (!rideData) return;

    // Send final list of responses
    await RideService.updateRide(rideId, {'status': 'Failed'});
    await this.sendMatchResponse(rideId, rideData.responses, rideData.riderId);
    
    // Cleanup
    this.driverResponses.delete(rideId);
    this.activeRequests.delete(rideId);
  }

  /**
   * This sends back information on the searched request by rider, back to rider
   * @param rideId 
   * @param drivers 
   * @param riderId 
   */
  private static async sendMatchResponse(rideId: string, drivers: DriverResponse[], riderId: string) {
    sendEventProducer({
      rideId,
      riderId,
      drivers,
      status: drivers.length > 0 ? 'matched' : 'no_matches'
    });
  }

  /**
   * 
   * @param rideId 
   * @param riderId 
   */
  private static async sendNoDriversMatchResponse(rideId: string, riderId: string) {
    await this.sendMatchResponse(rideId, [], riderId);
  }
}