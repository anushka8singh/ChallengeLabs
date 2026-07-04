import { dockerService } from "../../services/docker.service";

import { FeedbackBuilder } from "../builders/FeedbackBuilder";

import { ValidationResult } from "../types/ValidationResult";
import { ValidationType } from "../types/ValidationType";

export abstract class BaseValidationStrategy {

  protected async executeCommand(
    containerId: string,
    command: string
  ) {
    return dockerService.execInContainer(
      containerId,
      command
    );
  }

  protected success(
    type: ValidationType,
    feedback: string,
    output?: string,
    exitCode?: number,
    durationMs?: number
  ): ValidationResult {

    return {
      validationType: type,
      passed: true,
      feedback,
      output,
      exitCode,
      executedAt: new Date(),
      durationMs,
    };
  }

  protected failure(
    type: ValidationType,
    feedback: string,
    output?: string,
    exitCode?: number,
    durationMs?: number
  ): ValidationResult {

    return {
      validationType: type,
      passed: false,
      feedback,
      output,
      exitCode,
      executedAt: new Date(),
      durationMs,
    };
  }

  protected executionError(
    type: ValidationType,
    error: unknown
  ): ValidationResult {

    return {
      validationType: type,
      passed: false,
      feedback: FeedbackBuilder.executionError(
        error instanceof Error
          ? error.message
          : "Unknown error"
      ),
      executedAt: new Date(),
    };
  }
}