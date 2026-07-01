export class FeedbackBuilder {
  static success(message: string): string {
    return message;
  }

  static failure(message: string): string {
    return message;
  }

  static executionError(error: string): string {
    return `Validation execution failed: ${error}`;
  }

  static invalidConfiguration(): string {
    return "Invalid validation configuration.";
  }
}