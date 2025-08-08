import express, { Application } from "express";
import bodyParser from "body-parser";

// Import your route files here
import rideRoutes from "./routes/ride";

import ErroHandler from "./middleware/error";
import Logger from "./middleware/log";
import cors from "cors";
import http from "http";
import { Server, ServerOptions } from "socket.io";

import { WebSocketManager } from "./websockets/connectionManager";

const app: Application = express();

const server = http.createServer(app);

const options: Partial<ServerOptions> = {
    cors: {
      origin: "*", // Allow all origins for simplicity; restrict in production
    },
  };

export const io = new Server(server, options);


const wsManager = new WebSocketManager(io);
wsManager.init();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
app.use(cors());

// Use Routes
app.use("/api/ride", rideRoutes);



//handle logging
app.use(Logger.logRequest);
// Handle errors
app.use(ErroHandler);

export default server;
