import { kafkaConsumer } from '../config/kafka';
import { EventTypes } from '../events/eventTypes';
import { MessageService } from '../services/messageService';

export const catchEventConsumer = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: EventTypes.SEND_OTP });

  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value?.toString() || '{}');
        console.log('Received OTP event:', event);

        const { mediumType, medium, otp, user} = event;
        console.log('medium:', medium, 'otp:', otp, 'mediumType:', mediumType, user);
        if (!medium || !otp) {
          throw new Error('Missing medium or OTP')
        };

        await MessageService.sendMessage({
          mediumType,
          medium,
          content: otp,
          templateType: 'otp',
          user
        });
      } catch (error) {
        console.error('Error processing OTP event:', error);
      }
    },
  });
};