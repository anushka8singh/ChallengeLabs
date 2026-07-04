/**
 * Central registry for all validation strategies.
 *
 * To add a new validation type:
 * 1. Create a Strategy
 * 2. Register it here
 *
 * ValidationService never changes.
 */

import { ValidationType } from "../types/ValidationType";
import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import { CommandValidationStrategy } from "../strategies/CommandValidationStrategy";
import { DirectoryExistsStrategy } from "../strategies/DirectoryExistsStrategy";
import { FileExistsStrategy } from "../strategies/FileExistsStrategy";
import { FileContainsStrategy } from "../strategies/FileContainsStrategy";
import { PermissionValidationStrategy } from "../strategies/PermissionValidationStrategy";

export class ValidationFactory {

  private static readonly strategies = new Map<
    ValidationType,
    IValidationStrategy<unknown>
  >();

  static {

    this.strategies.set(
      ValidationType.COMMAND,
      new CommandValidationStrategy()
    );

    this.strategies.set(
      ValidationType.DIRECTORY_EXISTS,
      new DirectoryExistsStrategy()
    );

    this.strategies.set(
    ValidationType.FILE_EXISTS,
    new FileExistsStrategy()
);
  this.strategies.set(
    ValidationType.FILE_CONTAINS,
    new FileContainsStrategy()
);

this.strategies.set(
  ValidationType.PERMISSION,
  new PermissionValidationStrategy()
);


  }
  
  static getStrategy(
    type: ValidationType
  ): IValidationStrategy<unknown> {

    const strategy =
      this.strategies.get(type);

    if (!strategy) {

      throw new Error(
        `Validation strategy '${type}' is not registered.`
      );

    }

    return strategy;

  }

  static register(
  type: ValidationType,
  strategy: IValidationStrategy<unknown>
): void { {

    this.strategies.set(
      type,
      strategy
    );

  }
}
}