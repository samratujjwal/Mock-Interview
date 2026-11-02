import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./database/connection.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

let server;

const start = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! Shutting down...", err);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (err) {
    console.error("Failed to start server due to DB connection error", err);
    process.exit(1);
  }
};

start();

export default server;
