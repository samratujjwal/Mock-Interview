import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import cookieParser from "./middleware/cookieParser.js";
import requestId from "./middleware/requestId.js";
import errorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

// Global middleware
app.use(requestId);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple cookie parser (lightweight, avoids adding dependency)
app.use(cookieParser);

// API Base Route (/api/v1)
app.use("/api/v1", apiRouter);

// 404 Handler — forwards to the central error handler for a consistent envelope
app.use((req, res, next) => {
  next(
    new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, [
      { field: "url", message: "Endpoint does not exist" },
    ]),
  );
});

// Central error handler — must be last
app.use(errorHandler);

export default app;
