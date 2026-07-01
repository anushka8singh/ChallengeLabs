export interface CommandValidationConfig {
  command: string;
  expectedOutput?: string;
}

export interface DirectoryExistsValidationConfig {
  directories: string[];
}

export interface FileExistsValidationConfig {
  files: string[];
}

export interface FileContainsValidationConfig {
  file: string;
  contains: string;
}

export interface CommandOutputValidationConfig {
  command: string;
  expectedOutput: string;
}

export interface RegexValidationConfig {
  command: string;
  regex: string;
}

export interface PermissionValidationConfig {
  file: string;
  permission: string;
}

export interface UserExistsValidationConfig {
  username: string;
}

export interface ProcessRunningValidationConfig {
  process: string;
}

export interface CustomScriptValidationConfig {
  script: string;
}