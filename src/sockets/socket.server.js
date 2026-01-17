import { WebSocketServer } from "ws";

const clients = new Map();

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const userId = params.get("userId");

    if (!userId) return ws.close();

    clients.set(userId, ws);

    ws.on("close", () => {
      clients.delete(userId);
    });
  });
}

export function notifyUser(userId, payload) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}