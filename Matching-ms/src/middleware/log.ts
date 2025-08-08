import winston, { format, loggers, transports } from "winston";

class Logger {
  // Define a custom format for error logs
  static errorFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Custom timestamp format
    format.printf(({ timestamp, level, message, stack }) => {
      // If there's a stack trace, include it in the log; otherwise, just the message
      return stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${message}\nStack trace: ${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  );

  //initiate winston
  static logger = winston.createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.File({
        filename: "logs/error.log",
        level: "error",
        format: this.errorFormat,
      }),
      new transports.Console({ level: "info" }),
      new transports.Console({ level: "warn" }),
    ],
  });

    // Method to log messages (info, warn, error)
    static log(level: string, message: string, error?: Error) {
        if (error) {
        Logger.logger.log({
            level,
            message,
            stack: error.stack,
        });
        } else {
        Logger.logger.log({ level, message });
        }
    }
}

export default Logger;
