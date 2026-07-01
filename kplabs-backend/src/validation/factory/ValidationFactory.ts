import { ValidationType } from "../types/ValidationType";
import { IValidationStrategy } from "../interfaces/IValidationStrategy";

import { CommandValidationStrategy } from "../strategies/CommandValidationStrategy";
import { DirectoryExistsStrategy } from "../strategies/DirectoryExistsStrategy";

export class ValidationFactory {

  private static readonly strategies = new Map<
    ValidationType,
    IValidationStrategy<any>
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

  }

  static getStrategy(
    type: ValidationType
  ): IValidationStrategy<any> {

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
    strategy: IValidationStrategy<any>
  ) {

    this.strategies.set(
      type,
      strategy
    );

  }

}