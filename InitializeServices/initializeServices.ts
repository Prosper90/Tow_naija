import "dotenv/config";
import { Kafka } from "kafkajs";


async function initializeTopics(topics: string[]) {
  const kafka = new Kafka({
    clientId: "admin",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  });

  const admin = kafka.admin();

  try {
    await admin.connect();

    const existingTopics = await admin.listTopics();

    // Create topics that do not already exist
    const topicsToCreate = topics.filter((topic) => !existingTopics.includes(topic));

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      console.log(`Topics created successfully: ${topicsToCreate.join(", ")}`);
    } else {
      console.log("No new topics to create. All topics already exist.");
    }
  } catch (error) {
    console.error("Error initializing Kafka topics:", error);
    process.exit(1);
  } finally {
    await admin.disconnect();
  }
}

// List of all topics you expect to use
const predefinedTopics = ["send_otp", "ride_match", "ride_request"];

initializeTopics(predefinedTopics);