import mongoose from "mongoose";

// Keep Mongoose strictQuery behavior explicit
mongoose.set("strictQuery", true);

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set. Please set it in your environment.");
    // Fail fast — configuration is required to run the app
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // these flags are safe for modern mongoose/node versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose default connection is open");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose default connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose default connection disconnected");
    });

    // Graceful shutdown handlers
    const gracefulExit = async () => {
      console.log("Closing MongoDB connection...");
      await mongoose.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", gracefulExit);
    process.on("SIGTERM", gracefulExit);

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err; // let caller decide (start will exit)
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
