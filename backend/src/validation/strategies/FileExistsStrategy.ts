import { BaseValidationStrategy } from "./BaseValidationStrategy";
import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import {
  FileExistsValidationConfig,
} from "../types/ValidationConfig";

import { ValidationType } from "../types/ValidationType";

import { LinuxCommandBuilder } from "../builders/LinuxCommandBuilder";

export class FileExistsStrategy
  extends BaseValidationStrategy
  implements IValidationStrategy<FileExistsValidationConfig>
{
  async validate(
    containerId: string,
    config: FileExistsValidationConfig
  ) {

    const start = Date.now();

    try {

      const missing: string[] = [];

      for (const file of config.files) {

        const command =
          LinuxCommandBuilder.fileExists(
            file
          );

        const result =
          await this.executeCommand(
            containerId,
            command
          );

        if (result.exitCode !== 0) {
          missing.push(file);
        }

      }

      const duration =
        Date.now() - start;

      if (missing.length === 0) {

        return this.success(
          ValidationType.FILE_EXISTS,
          "All required files exist.",
          undefined,
          0,
          duration
        );

      }

      return this.failure(
        ValidationType.FILE_EXISTS,
        `Missing files: ${missing.join(", ")}`,
        undefined,
        1,
        duration
      );

    } catch (error) {

      return this.executionError(
        ValidationType.FILE_EXISTS,
        error
      );

    }
  }
}