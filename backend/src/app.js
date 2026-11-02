import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import cookieParser from './middleware/cookieParser.js';

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple cookie parser (lightweight, avoids adding dependency)
app.use(cookieParser);

// API Base Route (/api/v1)
app.use("/api/v1", apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errors: [
      {
        field: "url",
        message: "Endpoint does not exist"
      }
    ]
  });
});

export default app;
