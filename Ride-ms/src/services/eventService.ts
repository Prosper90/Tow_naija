import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import config from "../config";
import { io } from "../app";

class EventService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isProducerConnected: boolean = false;
  private isConsumerConnected: boolean = false;


  constructor() {
    this.kafka = new Kafka({
      clientId: "ride-ms",
      brokers: [config.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "tow-naija-ride" });
  }

  private async ensureProducerConnected() {
    if (!this.isProducerConnected) {
      await this.producer.connect();
      this.isProducerConnected = true;
    }
  }

  private async ensureConsumerConnected() {
    if (!this.isConsumerConnected) {
      await this.consumer.connect();
      this.isConsumerConnected = true;
    }
  }


  /**
   * Emit events to the kafka node in a topic
   * @param topic
   * @param message
   */
  public async emitEvent(topic: string, message: object) {
    try {
      await this.ensureProducerConnected();

      await this.producer.send({
        topic: topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.error('Error emitting event:', error);
      throw error;
    }
  }



  public async startListening() {
    try {
      await this.ensureConsumerConnected();

      // Subscribe to ride_match topic once
      await this.consumer.subscribe({ topic: 'ride_match', fromBeginning: false });

      await this.consumer.run({
        eachMessage: async (payload) => {
          const data = JSON.parse(payload.message.value?.toString() || '{}');

          // Emit the found data back to the user with the ride using socket
          io.to(`rider:${data.riderId}`).emit('rideRequestResponse', {
            ride: data.rideId,
            driversResponse: data.drivers
          });
          
        },
      });
    } catch (error) {
      console.error('Error starting listener:', error);
      throw error;
    }
  }

  // Add a cleanup method
  public async disconnect() {
    if (this.isProducerConnected) {
      await this.producer.disconnect();
      this.isProducerConnected = false;
    }
    await this.consumer.disconnect();
  }
}

// export default EventService;


// Export a singleton instance
export const eventService = new EventService();

