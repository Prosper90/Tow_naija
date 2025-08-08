import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import config from "../config";

class EventService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "rider-ms",
      brokers: [config.KAFKA_BROKER || 'localhost:9092'],
    });

    //initialize producer and consumer
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "tow-naija-rider" });
  }

  /**
   * Emit events to the kafka node in a topic
   * @param topic
   * @param message
   */
  public async emitEvent(topic: string, message: object) {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      throw error;
    } finally {
      await this.producer.disconnect();
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
      throw error;
    } finally {
      await this.consumer.disconnect();
    }
  }
}

export default EventService;
