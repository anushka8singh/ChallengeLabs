import { ValidationType } from "./ValidationType";

export interface ValidationResult {
  validationType: ValidationType;

  passed: boolean;

  feedback: string;

  output?: string;

  exitCode?: number;

  metadata?: Record<string, unknown>;

  executedAt: Date;

  durationMs?: number;
}