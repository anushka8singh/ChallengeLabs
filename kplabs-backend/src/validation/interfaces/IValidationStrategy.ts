import { ValidationResult } from "../types/ValidationResult";

export interface IValidationStrategy<TConfig> {
  validate(
    containerId: string,
    config: TConfig
  ): Promise<ValidationResult>;
}