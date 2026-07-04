import { BaseValidationStrategy } from "./BaseValidationStrategy";
import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import {
  FileContainsValidationConfig,
} from "../types/ValidationConfig";

import { ValidationType } from "../types/ValidationType";

import { LinuxCommandBuilder } from "../builders/LinuxCommandBuilder";

export class FileContainsStrategy
  extends BaseValidationStrategy
  implements IValidationStrategy<FileContainsValidationConfig>
{
  async validate(
    containerId: string,
    config: FileContainsValidationConfig
  ) {

    const start = Date.now();

    try {

      const command =
        LinuxCommandBuilder.fileContains(
          config.file,
          config.contains
        );

      const result =
        await this.executeCommand(
          containerId,
          command
        );

      const duration =
        Date.now() - start;

      if (result.exitCode === 0) {

        return this.success(
          ValidationType.FILE_CONTAINS,
          "File contains expected content.",
          result.output,
          result.exitCode,
          duration
        );

      }

      return this.failure(
        ValidationType.FILE_CONTAINS,
        "Expected content not found in file.",
        result.output,
        result.exitCode,
        duration
      );

    } catch (error) {

      return this.executionError(
        ValidationType.FILE_CONTAINS,
        error
      );

    }

  }
}