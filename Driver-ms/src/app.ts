import express, { Application } from "express";
import bodyParser from "body-parser";

// Import your route files here
import authRoutes from "./routes/auth";
import driverRoutes from "./routes/driver";
import documentRoutes from "./routes/document";
import vehicleRoutes from "./routes/vehicle";
import transactionRoutes from "./routes/transaction";


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
app.use("/api/driver", driverRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/transaction", transactionRoutes)



//handle logging
app.use(Logger.logRequest);
// Handle errors
app.use(ErroHandler);

export default app;
