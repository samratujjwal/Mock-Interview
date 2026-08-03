import { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.js";
import { registerInterviewHandlers } from "./interview.handlers.js";
import { corsOptions } from "../middleware/security.middleware.js";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: corsOptions,
  });

  const interviewNamespace = io.of("/interview");
  interviewNamespace.use(socketAuthMiddleware);
  registerInterviewHandlers(interviewNamespace);

  return io;
}
