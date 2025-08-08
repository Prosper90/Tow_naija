import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import config from "../config";

class EventService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isProducerConnected: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: "driver-ms",
      brokers: [config.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "tow-naija-driver" });
  }


    /**
   * Initialization step: Pre-create required topics
   * @param topics Array of topic names to ensure are created
   */
  public async initializeTopics(topics: string[]) {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      await admin.createTopics({
        topics: topics.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });

      console.log("Topics initialized:", topics);
      await admin.disconnect();
    } catch (error) {
      console.error("Error initializing topics:", error);
      throw error;
    }
  }

  private async ensureProducerConnected() {
    if (!this.isProducerConnected) {
      await this.producer.connect();
      this.isProducerConnected = true;
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

  public async listenToEvents(
    topic: string,
    callback: (payload: EachMessagePayload) => Promise<void>
  ) {
    try {
      await this.consumer.connect();

      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async (payload) => {
          await callback(payload);
        },
      });
    } catch (error) {
      console.error('Error listening to events:', error);
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