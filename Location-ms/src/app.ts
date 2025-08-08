import bodyParser from "body-parser";
import ErroHandler from "./middleware/error";
import Logger from "./middleware/log";
import cors from "cors";
import express, { Application } from "express";
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

  // Attach Socket.IO to the server
//   io.on("connection", (socket) => {
//     console.log("New client connected:");
  
//     // Handle player disconnection
//     socket.on("disconnect", () => {
//       console.log("Client disconnected");
//     });
//   });


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
app.use(cors());

//handle logging
app.use(Logger.logRequest);
// Handle errors
app.use(ErroHandler);

export default server;

