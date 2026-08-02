import { randomUUID } from "node:crypto";

export default function requestId(req, res, next) {
  const incoming = req.get("X-Request-Id");
  req.requestId = incoming || `req_${randomUUID()}`;
  res.setHeader("X-Request-Id", req.requestId);
  next();
}
