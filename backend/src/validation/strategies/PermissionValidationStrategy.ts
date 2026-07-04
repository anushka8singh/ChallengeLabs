import { BaseValidationStrategy } from "./BaseValidationStrategy";
import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import {
  PermissionValidationConfig,
} from "../types/ValidationConfig";

import { ValidationType } from "../types/ValidationType";

import { LinuxCommandBuilder } from "../builders/LinuxCommandBuilder";

export class PermissionValidationStrategy
  extends BaseValidationStrategy
  implements IValidationStrategy<PermissionValidationConfig>
{
  async validate(
    containerId: string,
    config: PermissionValidationConfig
  ) {

    const start = Date.now();

    try {

      const command =
        LinuxCommandBuilder.permission(
          config.file,
          config.permission
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
          ValidationType.PERMISSION,
          "File permission validated successfully.",
          result.output,
          result.exitCode,
          duration
        );

      }

      return this.failure(
        ValidationType.PERMISSION,
        `Expected permission '${config.permission}' not found.`,
        result.output,
        result.exitCode,
        duration
      );

    } catch (error) {

      return this.executionError(
        ValidationType.PERMISSION,
        error
      );

    }

  }
}