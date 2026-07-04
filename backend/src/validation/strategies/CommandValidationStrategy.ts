import { BaseValidationStrategy } from "./BaseValidationStrategy";
import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import {
  CommandValidationConfig,
} from "../types/ValidationConfig";

import { ValidationType } from "../types/ValidationType";

export class CommandValidationStrategy
  extends BaseValidationStrategy
  implements
    IValidationStrategy<CommandValidationConfig>
{
  async validate(
    containerId: string,
    config: CommandValidationConfig
  ) {

    const start = Date.now();

    try {

      const result =
        await this.executeCommand(
          containerId,
          config.command
        );

      const output =
        result.output ?? "";

      let passed =
        result.exitCode === 0;

      if (
        passed &&
        config.expectedOutput
      ) {
        passed =
          output.includes(
            config.expectedOutput
          );
      }

      const duration =
        Date.now() - start;

      if (passed) {

        return this.success(
          ValidationType.COMMAND,
          "Command validation passed.",
          output,
          result.exitCode,
          duration
        );

      }

      return this.failure(
        ValidationType.COMMAND,
        "Command validation failed.",
        output,
        result.exitCode,
        duration
      );

    } catch (error) {

      return this.executionError(
        ValidationType.COMMAND,
        error
      );

    }
  }
}