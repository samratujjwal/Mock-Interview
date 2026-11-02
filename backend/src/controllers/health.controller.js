/**
 * Health controller for handling system health check and ping endpoints.
 * Follows Rule 5 (thin controller with no business logic).
 */

export const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is healthy",
    data: {
      status: "UP",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    }
  });
};

export const getPing = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "pong"
  });
};
