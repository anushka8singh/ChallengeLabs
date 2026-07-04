import { ValidationType } from "./ValidationType";

export interface ValidationTask {

  type: ValidationType;

  config: unknown;

  required: boolean;

  order: number;

  description?: string;

}