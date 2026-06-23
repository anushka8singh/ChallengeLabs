import { io, Socket } from 'socket.io-client';

class TerminalSocketService {
  private socket: Socket | null = null;

  connect(
    onOutput: (data: string) => void,
    onError: (err: string) => void,
    onClosed: (reason: string) => void,
    onConnected?: () => void
  ) {
    if (this.socket) {
      console.log('CONNECT CALLED');
      this.socket.disconnect();
    }

    const token = localStorage.getItem('token');
    if (!token) {
      onError('Authentication token is missing');
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    // Remove /api if present at the end
    const url = socketUrl.endsWith('/api') ? socketUrl.slice(0, -4) : socketUrl;

    this.socket = io(url, {
      auth: {
        token,
      },
      transports: ['websocket'], // force websocket for reliable connection
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
  console.log('Socket.IO connection established');

  if (onConnected) {
    onConnected();
  }
});

   this.socket.on('terminal:connected', (data) => {
  console.log('Terminal connected', data);
});

    this.socket.on('terminal:output', (data: string) => {
      onOutput(data);
    });

    this.socket.on('terminal:error', (err: { message: string }) => {
      onError(err?.message || 'Terminal error occurred');
    });

    this.socket.on('terminal:closed', (payload: { reason?: string }) => {
      onClosed(payload?.reason || 'session closed');
    });

    this.socket.on('connect_error', (error) => {
      onError(error.message || 'Connection error');
    });
  }

  joinSession(sessionId: string) {
    if (this.socket) {
      this.socket.emit('terminal:connect', { sessionId });
    }
  }

  sendInput(data: string) {
    if (this.socket) {
      this.socket.emit('terminal:input', data);
    }
  }

  resize(cols: number, rows: number) {
    if (this.socket) {
      this.socket.emit('terminal:resize', { cols, rows });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.emit('terminal:disconnect');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const terminalSocketService = new TerminalSocketService();
export default terminalSocketService;
