import dotenv from 'dotenv';
import { catchEventConsumer } from './consumers/catchEventConsumer';
import Logger from './middleware/log';

dotenv.config();

const run = async () => {
  try {
    Logger.log('info', 'Starting messaging-ms...');
    await catchEventConsumer();
    Logger.log('info', 'Kafka consumers are running...');
  } catch (error) {
    Logger.log('error', 'Error starting messaging-ms', error as Error);
    process.exit(1);
  }
};

run();