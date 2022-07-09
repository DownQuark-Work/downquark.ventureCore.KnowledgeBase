import { WEBSOCKET_URL } from '../_utils/constants.ts'
import { wsHandlerClient } from './utils.websocket.ts'

console.log("Connecting to server ...");
try {
  const ws = new WebSocket(WEBSOCKET_URL);
  ws.onopen = () => wsHandlerClient.handleConnected(ws);
  ws.onmessage = (m) => wsHandlerClient.handleMessage(ws, m.data);
  ws.onclose = () => wsHandlerClient.logError("Disconnected from server ...");
  ws.onerror = (e) => wsHandlerClient.handleError(e);
} catch (err) {
  wsHandlerClient.logError("Failed to connect to server ... exiting");
}
