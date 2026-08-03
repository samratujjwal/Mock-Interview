import { io } from "socket.io-client";

function deriveSocketBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  return apiUrl.replace(/\/api\/v1\/?$/, "");
}

export function createInterviewSocket(accessToken) {
  return io(`${deriveSocketBaseUrl()}/interview`, {
    auth: { token: accessToken },
    withCredentials: true,
    autoConnect: false,
  });
}
