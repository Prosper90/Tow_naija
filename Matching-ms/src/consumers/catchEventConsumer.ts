import { kafkaConsumer } from '../config/kafka';
import { MatchService } from '../services/matchService';
import { RideRequestEvent } from '../utils/interface';

export const catchEventConsumer = async () => {

  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topics: ['ride_request', "notify_driver_of_accepted_ride"] });

  await kafkaConsumer.run({

    eachMessage: async ({topic, message }) => {
      try {
        const event : RideRequestEvent = JSON.parse(message.value?.toString() || '{}');
        // console.log('Received request_ride event:', event);

        if (!event) {
          throw new Error('Missing event')
        };

        if (topic === 'ride_request') { 
          await MatchService.findMatch(event);
        } else if(topic === "notify_driver_of_accepted_ride") {
          await MatchService.NotifyDriverOfAcceptedRequest(event);
        }

      } catch (error) {
        console.error('Error processing OTP event:', error);
      }
    },
  });
};