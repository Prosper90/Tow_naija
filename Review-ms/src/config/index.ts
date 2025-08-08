import { Config } from "../utils/interface";

const config: Config = {
  MONGO_URI: process.env.MONGO_URI || "localhost:2701",
  JWT_SECRET: process.env.JWT_SECRET || "Random_secret",
  PORT: process.env.PORT || 8000,
  HOSTNAME: process.env.HOSTNAME || "localhost",
};

export default config;
