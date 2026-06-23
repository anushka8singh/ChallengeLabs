// ===========================================
// Docker Service
// Real Docker container lifecycle management using Dockerode (Phase 5)
// No shell commands - pure Dockerode SDK
// ===========================================

import Docker from 'dockerode';
import os from 'os';
import { logger } from '../config/logger';

const dockerLogger = logger.child({ service: 'docker' });

type DockerConnection = {
  options: Docker.DockerOptions;
  method: string;
  source: 'DOCKER_HOST' | 'platform default';
};

export class DockerService {
  private docker: Docker;
  private readonly connection: DockerConnection;

  constructor() {
    this.connection = this.resolveDockerConnection();
    this.docker = new Docker(this.connection.options);

    dockerLogger.info(
      {
        operatingSystem: `${os.type()} ${os.release()}`,
        platform: process.platform,
        architecture: process.arch,
        connectionMethod: this.connection.method,
        connectionSource: this.connection.source,
      },
      'Docker client initialized'
    );
  }

  private resolveDockerConnection(): DockerConnection {
    const dockerHost = process.env.DOCKER_HOST?.trim();

    if (dockerHost) {
      return this.resolveDockerHost(dockerHost);
    }

    if (process.platform === 'win32') {
      return {
        options: { socketPath: '//./pipe/docker_engine' },
        method: 'Windows named pipe: //./pipe/docker_engine',
        source: 'platform default',
      };
    }

    return {
      options: { socketPath: '/var/run/docker.sock' },
      method: 'Unix socket: /var/run/docker.sock',
      source: 'platform default',
    };
  }

  private resolveDockerHost(dockerHost: string): DockerConnection {
    if (dockerHost.startsWith('unix://')) {
      const socketPath = dockerHost.replace('unix://', '');

      return {
        options: { socketPath },
        method: `Unix socket from DOCKER_HOST: ${socketPath}`,
        source: 'DOCKER_HOST',
      };
    }

    if (dockerHost.startsWith('npipe://')) {
      const socketPath = dockerHost.replace('npipe://', '');

      return {
        options: { socketPath },
        method: `Windows named pipe from DOCKER_HOST: ${socketPath}`,
        source: 'DOCKER_HOST',
      };
    }

    if (
      dockerHost.startsWith('tcp://') ||
      dockerHost.startsWith('http://') ||
      dockerHost.startsWith('https://')
    ) {
      const normalizedHost = dockerHost.replace('tcp://', 'http://');
      const url = new URL(normalizedHost);

      return {
        options: {
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
          host: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 2376 : 2375),
        },
        method: `${url.protocol.replace(':', '')} endpoint from DOCKER_HOST: ${url.host}`,
        source: 'DOCKER_HOST',
      };
    }

    return {
      options: { socketPath: dockerHost },
      method: `Socket path from DOCKER_HOST: ${dockerHost}`,
      source: 'DOCKER_HOST',
    };
  }

  private serializeDockerError(error: unknown) {
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException & {
        address?: string;
        path?: string;
        port?: number;
      };

      return {
        name: error.name,
        message: error.message,
        code: nodeError.code,
        errno: nodeError.errno,
        syscall: nodeError.syscall,
        path: nodeError.path,
        address: nodeError.address,
        port: nodeError.port,
      };
    }

    return { message: String(error) };
  }

  /**
   * Startup health check for Docker connectivity.
   */
  async startupHealthCheck(): Promise<boolean> {
    const available = await this.isDockerAvailable();
    const logPayload = {
      operatingSystem: `${os.type()} ${os.release()}`,
      platform: process.platform,
      connectionMethod: this.connection.method,
      connectionSource: this.connection.source,
      pingResult: available ? 'success' : 'failed',
    };

    if (available) {
      dockerLogger.info(logPayload, 'Docker startup health check passed');
    } else {
      dockerLogger.warn(logPayload, 'Docker startup health check failed');
    }

    return available;
  }

  /**
   * Check if Docker daemon is available.
   */
  async isDockerAvailable(): Promise<boolean> {
    try {
      await this.docker.ping();
      dockerLogger.debug(
        {
          connectionMethod: this.connection.method,
          pingResult: 'success',
        },
        'Docker ping succeeded'
      );
      return true;
    } catch (error) {
      dockerLogger.error(
        {
          connectionMethod: this.connection.method,
          pingResult: 'failed',
          error: this.serializeDockerError(error),
        },
        'Docker ping failed'
      );
      return false;
    }
  }

  /**
   * Get current Docker connection details for diagnostics.
   */
  getConnectionInfo() {
    return {
      operatingSystem: `${os.type()} ${os.release()}`,
      platform: process.platform,
      connectionMethod: this.connection.method,
      connectionSource: this.connection.source,
    };
  }

  /**
   * Pull Docker image if not present locally
   */
  async pullImage(image: string): Promise<void> {
    try {
      const images = await this.docker.listImages();
      const imageExists = images.some((img: any) =>
        img.RepoTags && img.RepoTags.includes(image)
      );

      if (imageExists) {
        dockerLogger.info({ image }, 'Image already exists locally');
        return;
      }

      dockerLogger.info({ image }, 'Pulling Docker image...');

      await new Promise<void>((resolve, reject) => {
        this.docker.pull(image, (err: Error | null, stream: NodeJS.ReadableStream) => {
          if (err) return reject(err);

          this.docker.modem.followProgress(stream, (err: Error | null) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      dockerLogger.info({ image }, 'Image pulled successfully');
    } catch (error: any) {
      dockerLogger.error({ image, error: error.message }, 'Failed to pull image');
      throw new Error(`Failed to pull image ${image}: ${error.message}`);
    }
  }

  /**
   * Create a new container with strict isolation
   */
  async createContainer(
    image: string,
    userId: string,
    challengeId: string
  ): Promise<{ containerId: string; containerName: string }> {
    const timestamp = Date.now();
    const shortUserId = userId.substring(0, 8);
    const containerName = `kplabs-${shortUserId}-${timestamp}`;

    const containerConfig = {
      Image: image,
      name: containerName,
      Tty: true,
      OpenStdin: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        Memory: 512 * 1024 * 1024, // 512MB
        NanoCpus: 1000000000,      // 1 CPU core
        Privileged: false,
        AutoRemove: false,
        NetworkMode: 'bridge',
        SecurityOpt: ['no-new-privileges'],
      },
      Env: [
        `KPLABS_USER_ID=${userId}`,
        `KPLABS_CHALLENGE_ID=${challengeId}`,
        'TERM=xterm-256color',
      ],
    };

    try {
      const container = await this.docker.createContainer(containerConfig);
      dockerLogger.info(
        { containerId: container.id, containerName, image },
        'Container created successfully'
      );

      return {
        containerId: container.id,
        containerName,
      };
    } catch (error: any) {
      dockerLogger.error(
        { image, error: error.message },
        'Failed to create container'
      );
      throw new Error(`Failed to create container: ${error.message}`);
    }
  }

  /**
   * Start a container
   */
  async startContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.start();
      dockerLogger.info({ containerId }, 'Container started successfully');
    } catch (error: any) {
      dockerLogger.error({ containerId, error: error.message }, 'Failed to start container');
      throw new Error(`Failed to start container: ${error.message}`);
    }
  }

  /**
   * Stop a container
   */
  async stopContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop({ t: 10 }); // 10 second grace period
      dockerLogger.info({ containerId }, 'Container stopped successfully');
    } catch (error: any) {
      // Container might already be stopped
      if (error.statusCode === 304) {
        dockerLogger.warn({ containerId }, 'Container already stopped');
        return;
      }
      dockerLogger.error({ containerId, error: error.message }, 'Failed to stop container');
      throw new Error(`Failed to stop container: ${error.message}`);
    }
  }

  /**
   * Remove a container
   */
  async removeContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.remove({ force: true });
      dockerLogger.info({ containerId }, 'Container removed successfully');
    } catch (error: any) {
      if (error.statusCode === 404) {
        dockerLogger.warn({ containerId }, 'Container already removed');
        return;
      }
      dockerLogger.error({ containerId, error: error.message }, 'Failed to remove container');
      throw new Error(`Failed to remove container: ${error.message}`);
    }
  }

  /**
   * Inspect container details
   */
  async inspectContainer(containerId: string): Promise<any> {
    try {
      const container = this.docker.getContainer(containerId);
      return await container.inspect();
    } catch (error: any) {
      dockerLogger.error({ containerId, error: error.message }, 'Failed to inspect container');
      throw new Error(`Failed to inspect container: ${error.message}`);
    }
  }

  /**
   * Get container stats (for monitoring)
   */
  async getContainerStats(containerId: string): Promise<any> {
    try {
      const container = this.docker.getContainer(containerId);
      return await container.stats({ stream: false });
    } catch (error: any) {
      dockerLogger.error({ containerId, error: error.message }, 'Failed to get container stats');
      throw new Error(`Failed to get container stats: ${error.message}`);
    }
  }

  /**
   * List all containers (for debugging)
   */
  async listContainers(): Promise<any[]> {
    return this.docker.listContainers({ all: true });
  }

    /**
   * Create an interactive exec instance inside a container (for terminal)
   */
  async createExec(
    containerId: string,
    cmd: string[] = ['/bin/bash', '-i']
  ): Promise<any> {
    try {
      const container = this.docker.getContainer(containerId);
      const exec = await container.exec({
        Cmd: cmd,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Env: ['TERM=xterm-256color'],
      });
      dockerLogger.info({ containerId, cmd }, 'Interactive exec created');
      return exec;
    } catch (error: any) {
      dockerLogger.error({ containerId, error: error.message }, 'Failed to create exec');
      throw new Error(`Failed to create exec: ${error.message}`);
    }
  }

  /**
   * Resize the TTY of an active exec (for terminal resize)
   */
  async resizeExec(exec: any, cols: number, rows: number): Promise<void> {
    try {
      await exec.resize({ h: rows, w: cols });
      dockerLogger.info({ cols, rows }, 'Exec TTY resized');
    } catch (error: any) {
      dockerLogger.error({ error: error.message }, 'Failed to resize exec');
    }
  }

  /**
   * Start and attach to an exec stream for bidirectional communication
   */
  async attachExec(exec: any): Promise<any> {
    try {
      const stream = await exec.start({
        hijack: true,
        stdin: true,
      });
      dockerLogger.info('Exec stream attached successfully');
      return stream;
    } catch (error: any) {
      dockerLogger.error({ error: error.message }, 'Failed to attach exec stream');
      throw new Error(`Failed to attach exec: ${error.message}`);
    }
  }
  
  async execInContainer(
    containerId: string,
    command: string
  ): Promise<{ exitCode: number; output: string }> {
    try {
      const container = this.docker.getContainer(containerId);

      const exec = await container.exec({
        Cmd: ['sh', '-c', command],
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
      });

      const stream = await exec.start({ hijack: true, stdin: false });

      let output = '';

      stream.on('data', (chunk: Buffer) => {
  const cleaned =
    chunk.length > 8
      ? chunk.subarray(8).toString('utf8')
      : '';

  output += cleaned;
});

      return new Promise((resolve, reject) => {
        stream.on('end', async () => {
          try {
            const inspectResult = await exec.inspect();
            resolve({
              exitCode: inspectResult.ExitCode || 0,
              output: output.trim(),
            });
          } catch (inspectError) {
            reject(inspectError);
          }
        });

        stream.on('error', (err) => reject(err));
      });
    } catch (error: any) {
      dockerLogger.error(
        { containerId, command, error: error.message },
        'Failed to execute command in container'
      );
      throw new Error(`Failed to execute command in container: ${error.message}`);
    }
  }
}

export const dockerService = new DockerService();
