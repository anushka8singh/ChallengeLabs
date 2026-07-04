export class LinuxCommandBuilder {
  static directoryExists(path: string): string {
    return `test -d "${path}"`;
  }

  static fileExists(path: string): string {
    return `test -f "${path}"`;
  }

  static fileContains(
    file: string,
    text: string
  ): string {
    return `grep -q '${text}' "${file}"`;
  }

  static commandOutput(
    command: string
  ): string {
    return command;
  }

  static regex(
    command: string,
    pattern: string
  ): string {
    return `${command} | grep -E '${pattern}'`;
  }

  static permission(
    file: string,
    permission: string
  ): string {
    return `[ "$(stat -c '%a' "${file}")" = "${permission}" ]`;
  }

  static userExists(
    username: string
  ): string {
    return `id ${username}`;
  }

  static processRunning(
    process: string
  ): string {
    return `pgrep ${process}`;
  }

  static customScript(
    script: string
  ): string {
    return script;
  }
}