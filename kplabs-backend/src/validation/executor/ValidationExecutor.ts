import { ValidationFactory } from "../factory/ValidationFactory";
import { ValidationResult } from "../types/ValidationResult";

import { ValidationTask } from "../types/ValidationTask";

export class ValidationExecutor {

  async execute(

    containerId: string,

    validations: ValidationTask[]

  ): Promise<ValidationResult[]> {

    const results: ValidationResult[] = [];

    for (const validation of validations) {

      const strategy =
        ValidationFactory.getStrategy(
          validation.type
        );

      const result =
        await strategy.validate(
          containerId,
          validation.config as never
        );

      results.push(result);

    }

    return results;

  }

  async executeAndAggregate(

    containerId: string,

    validations: ValidationTask[]

  ) {

    const results =
      await this.execute(
        containerId,
        validations
      );

    const passed =
      results.every(
        (r) => r.passed
      );

    return {

      passed,

      results,

      feedback:
        results
          .map((r) => r.feedback)
          .join("\n")

    };

  }

}