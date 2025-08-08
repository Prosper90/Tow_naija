import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { catchEventConsumer } from './consumers/catchEventConsumer';
import Logger from './middleware/log';
import { setupSocketHandlers } from './events/socketHandlers';
import mongoose from "mongoose";


dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const run = async () => {
  try {
    
    Logger.log('info', 'Starting matching-ms...');

    // Logging the connection URL
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });

    
    // Setup Socket.IO handlers
    setupSocketHandlers(io);
    
    // Start HTTP server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      Logger.log('info', `Socket.IO server running on port ${PORT}`);
    });

    // Start Kafka consumer
    await catchEventConsumer();
    Logger.log('info', 'Kafka consumers are running...');
  } catch (error) {
    Logger.log('error', 'Error starting matching-ms', error as Error);
    process.exit(1);
  }
};

run();