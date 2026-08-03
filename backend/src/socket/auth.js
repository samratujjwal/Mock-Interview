import authService from "../services/auth.service.js";
import { User } from "../models/index.js";

export async function socketAuthMiddleware(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");
    if (!token) return next(new Error("Missing authentication token"));

    const payload = authService.verifyAccessToken(token);
    if (!payload?.sub) return next(new Error("Invalid or expired token"));

    const user = await User.findById(payload.sub).lean().exec();
    if (!user) return next(new Error("User not found"));

    socket.user = user;
    return next();
  } catch (err) {
    return next(new Error("Authentication failed"));
  }
}
