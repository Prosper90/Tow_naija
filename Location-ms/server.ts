import "dotenv/config";
import mongoose from "mongoose";
import config from "./src/config";
import server from "./src/app";



// Logging the connection URL
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });




// Start the server
const PORT = config.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Location service running on port ${config.HOSTNAME} ${PORT}`);
});

// app.listen(config.PORT, () => {
//   return console.log(
//     `Express is listening at http://${config.HOSTNAME}:${config.PORT}`
//   );
// });

// process.on("SIGINT", async () => {
//   try {
//     await mongoose.connection.close();
//     console.log("Shutting down server...");
//     console.log("Server successfully shutdown");
//     process.exit(0);
//   } catch (err) {
//     console.error("Error during shutdown:", err);
//     process.exit(1);
//   }
// });
