import { BaseValidationStrategy } from "./BaseValidationStrategy";

import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import {
  DirectoryExistsValidationConfig,
} from "../types/ValidationConfig";

import { ValidationType } from "../types/ValidationType";

import { LinuxCommandBuilder } from "../builders/LinuxCommandBuilder";

export class DirectoryExistsStrategy
  extends BaseValidationStrategy
  implements
    IValidationStrategy<DirectoryExistsValidationConfig>
{
  async validate(
    containerId: string,
    config: DirectoryExistsValidationConfig
  ) {

    const start = Date.now();

    try {

      const missing: string[] = [];

      for (const dir of config.directories) {

        const command =
          LinuxCommandBuilder.directoryExists(
            dir
          );

        const result =
          await this.executeCommand(
            containerId,
            command
          );

        if (result.exitCode !== 0) {
          missing.push(dir);
        }

      }

      const duration =
        Date.now() - start;

      if (missing.length === 0) {

        return this.success(
          ValidationType.DIRECTORY_EXISTS,
          "All required directories exist.",
          undefined,
          0,
          duration
        );

      }

      return this.failure(
        ValidationType.DIRECTORY_EXISTS,
        `Missing directories: ${missing.join(", ")}`,
        undefined,
        1,
        duration
      );

    } catch (error) {

      return this.executionError(
        ValidationType.DIRECTORY_EXISTS,
        error
      );

    }
  }
}