import express, { Application } from "express";
import bodyParser from "body-parser";

// Import your route files here
import authRoutes from "./routes/auth";
import riderRoutes from "./routes/rider";

import ErroHandler from "./middleware/error";
import Logger from "./middleware/log";
import cors from "cors";

const app: Application = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
app.use(cors());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/rider", riderRoutes);


//handle logging
app.use(Logger.logRequest);
// Handle errors
app.use(ErroHandler);

export default app;
