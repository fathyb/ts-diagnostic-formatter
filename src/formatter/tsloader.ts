import * as os from "os";
import { Diagnostic, DiagnosticCategory } from "typescript";
import { FormattedDiagnostic, formatFilePath, formatDiagnosticMessage } from "../util";
const chalk = require("chalk");

export default (diagnostics: Array<Diagnostic>, context: string): FormattedDiagnostic => {
  const file = diagnostics[0].file != null ? diagnostics[0].file : null;
  const filePath = file != null ? formatFilePath(file.fileName, context) : undefined;

  const message =
    diagnostics
      .map(diagnostic => {
        const errorCategory = DiagnosticCategory[diagnostic.category].toLowerCase();
        const errorCategoryAndCode = `${errorCategory} TS${diagnostic.code}: `;
        const messageText = chalk.red(errorCategoryAndCode + formatDiagnosticMessage(diagnostic, os.EOL, context));

        let message = messageText;

        if (diagnostic.file != null && diagnostic.start != null) {
          const lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          message = `(${chalk.cyan(lineChar.line + 1)},${chalk.cyan(lineChar.character + 1)}): ${messageText}`;
        }
        return message;
      })
      .join(os.EOL) + os.EOL;

  return new FormattedDiagnostic(message, filePath);
};
