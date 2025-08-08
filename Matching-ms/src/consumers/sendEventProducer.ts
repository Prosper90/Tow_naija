import { kafkaProducer } from "../config/kafka"
import { DriverResponse } from "../utils/interface";


export const sendEventProducer = async (value: {rideId: string, riderId: string, drivers: DriverResponse[], status: string}) => {
    await kafkaProducer.connect();
  try {
    await kafkaProducer.send({
        topic: 'ride_match',
        messages: [{
          value: JSON.stringify(value)
        }]
      });
  } catch (error) {
    throw error;
  }
}