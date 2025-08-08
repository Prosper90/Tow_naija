import "dotenv/config";
import mongoose from "mongoose";
import config from "./src/config";
// import server from "./src/app";
import app from "./src/app";
import AdminRepository from "./src/repositories/adminRepository";
import bcrypt from "bcrypt";


//write a function to create a suer admin with an easy password
const CreateAdmin = async () => {
  try {
    //we initialize a new instance of the repo class
    const adminInstance = new AdminRepository();
    //now we check that super admin exists on the db
    const check = await adminInstance.findOneByField({role: "SuperAdmin"});

    //hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("diditechnologies01@gmail", saltRounds);
    
    if(!check) {
      //create the said admin
      adminInstance.create({
        email: "diditechnologies01@gmail.com",
        password: hashedPassword,
        role: "SuperAdmin"
      })

      console.log("Super Admin created");
    }
    
    return;
  } catch (error) {
    console.error("Something went wrong", error);
  }
}  

// Logging the connection URL
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });



  app.listen(config.PORT, async () => {
    await CreateAdmin()
    return console.log(
      `Express is listening at http://${config.HOSTNAME}:${config.PORT}`
    );
});


process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Shutting down server...");
    console.log("Server successfully shutdown");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});
