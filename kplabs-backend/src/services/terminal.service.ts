// ===========================================
// Terminal Service
// Business logic for real-time browser terminal (Phase 7)
// Reuses existing dockerService and sessionRepository
// ===========================================

import { dockerService } from './docker.service';
import { sessionRepository } from '../repositories/session.repository';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import { SessionStatus } from '@prisma/client';
import { Socket } from 'socket.io';

const terminalLogger = logger.child({ service: 'terminal' });

export class TerminalService {
  private activeTerminals: Map<string, { 
    exec: any; 
    stream: any; 
    socket: Socket 
  }> = new Map();

async connectTerminal(
  socket: Socket,
  sessionId: string,
  userId: string
): Promise<void> {
  console.log('STEP 1: connectTerminal entered');
  console.log({ sessionId, userId });

  const session = await sessionRepository.findById(sessionId);

  console.log('STEP 2: session lookup complete');
  console.log(session);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.userId !== userId) {
    throw new AppError('Unauthorized access to session', 403);
  }

  if (session.status !== SessionStatus.RUNNING) {
    throw new AppError('Session is not running', 400);
  }

  if (!session.containerId) {
    throw new AppError('No container associated with session', 400);
  }

  if (this.activeTerminals.has(sessionId)) {
    console.log('STEP 3: disconnecting existing terminal');
    await this.disconnectTerminal(sessionId);
  }

  try {
    console.log('STEP 4: creating exec');

    let exec;

    try {
      console.log('STEP 4A: trying bash');

      exec = await dockerService.createExec(
        session.containerId,
        ['/bin/bash', '-i']
      );

      console.log('STEP 4B: bash exec created');
    } catch (bashError: any) {
      console.error('BASH FAILED');
      console.error(bashError);

      terminalLogger.warn(
        { sessionId, error: bashError.message },
        'Bash not available, using /bin/sh'
      );

      console.log('STEP 4C: trying sh');

      exec = await dockerService.createExec(
        session.containerId,
        ['/bin/sh', '-i']
      );

      console.log('STEP 4D: sh exec created');
    }

    console.log('STEP 5: attaching stream');

    const stream = await dockerService.attachExec(exec);

    console.log('STEP 6: stream attached');

    this.activeTerminals.set(sessionId, {
      exec,
      stream,
      socket,
    });

   stream.on('data', (chunk: Buffer) => {
  let data = chunk;

  if (data.length > 8) {
    data = data.subarray(8);
  }

  socket.emit(
    'terminal:output',
    data.toString('utf8')
  );
});
    stream.on('error', (err: Error) => {
      console.error('STREAM ERROR');
      console.error(err);

      terminalLogger.error(
        { sessionId, error: err.message },
        'Terminal stream error'
      );

      socket.emit('terminal:error', {
        message: 'Terminal stream error occurred',
      });
    });

    stream.on('end', () => {
      console.log('STREAM ENDED');

      terminalLogger.info(
        { sessionId },
        'Terminal stream ended'
      );

      socket.emit('terminal:closed', {
        reason: 'container_closed',
      });

      this.activeTerminals.delete(sessionId);
    });

    (socket as any).currentSessionId = sessionId;

    console.log('STEP 7: emitting terminal:connected');

    socket.emit('terminal:connected', {
      sessionId,
      containerId: session.containerId,
      message: 'Terminal connected to container',
    });

    console.log('STEP 8: terminal connected success');

  } catch (error: any) {
    console.error('TERMINAL CONNECTION FAILED');
    console.error(error);

    terminalLogger.error(
      {
        sessionId,
        userId,
        error: error.message,
      },
      'Failed to connect terminal'
    );

    throw new AppError(
      `Failed to connect terminal: ${error.message}`,
      500
    );
  }
}

  async handleInput(sessionId: string, data: string): Promise<void> {
    const terminal = this.activeTerminals.get(sessionId);
    if (!terminal || !terminal.stream) {
      throw new AppError('No active terminal connection', 400);
    }

    try {
      terminal.stream.write(data);
    } catch (error: any) {
      terminalLogger.error({ sessionId, error: error.message }, 'Failed to write input');
      throw new AppError('Failed to send input to terminal', 500);
    }
  }

  async handleResize(sessionId: string, cols: number, rows: number): Promise<void> {
    const terminal = this.activeTerminals.get(sessionId);
    if (!terminal || !terminal.exec) {
      throw new AppError('No active terminal connection', 400);
    }

    try {
      await dockerService.resizeExec(terminal.exec, cols, rows);
    } catch (error: any) {
      terminalLogger.warn({ sessionId, error: error.message }, 'Resize operation failed');
    }
  }

  async disconnectTerminal(sessionId: string): Promise<void> {
    const terminal = this.activeTerminals.get(sessionId);
    if (!terminal) return;

    try {
      if (terminal.stream) {
        terminal.stream.end();
      }
      this.activeTerminals.delete(sessionId);
      terminalLogger.info({ sessionId }, 'Terminal disconnected (socket only)');
    } catch (error: any) {
      terminalLogger.warn({ sessionId, error: error.message }, 'Error during terminal disconnect');
      this.activeTerminals.delete(sessionId);
    }
  }
}

export const terminalService = new TerminalService();