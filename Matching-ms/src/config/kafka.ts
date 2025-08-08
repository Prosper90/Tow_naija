import { Kafka, logLevel } from 'kafkajs';
import Logger from '../middleware/log';


// Map Kafka log levels to Winston log levels
const logCreator = () => ({ level, log }: any) => {
    const { message, ...extra } = log;
  
    switch (level) {
      case logLevel.ERROR:
        Logger.log('error', message, new Error(JSON.stringify(extra)));
        break;
      case logLevel.WARN:
        Logger.log('warn', message);
        break;
      case logLevel.INFO:
        Logger.log('info', message);
        break;
      case logLevel.DEBUG:
        Logger.log('info', message);
        break;
      default:
        break;
    }
  };

const kafka = new Kafka({
  clientId: 'matching-ms',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.INFO,
  logCreator,
});

export const kafkaConsumer = kafka.consumer({ groupId: 'matching-group' });
export const kafkaProducer = kafka.producer();