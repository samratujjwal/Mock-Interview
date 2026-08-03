import { SERVER_EVENTS } from "./events.js";

const rooms = new Map(); // room -> { intervalId, refCount, startedAt }

export function startRoomTimer(namespace, room, startedAt) {
  const existing = rooms.get(room);
  if (existing) {
    existing.refCount += 1;
    return;
  }

  const intervalId = setInterval(() => {
    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(startedAt).getTime()) / 1000,
    );
    namespace.to(room).emit(SERVER_EVENTS.TIMER_UPDATED, { elapsedSeconds });
  }, 1000);

  rooms.set(room, { intervalId, refCount: 1, startedAt });
}

export function stopRoomTimer(room) {
  const entry = rooms.get(room);
  if (!entry) return;

  entry.refCount -= 1;
  if (entry.refCount <= 0) {
    clearInterval(entry.intervalId);
    rooms.delete(room);
  }
}
