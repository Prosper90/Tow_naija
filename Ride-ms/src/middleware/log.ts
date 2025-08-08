import { NextFunction, Request, Response } from "express";
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

  //catch req and call winston for info
  static logRequest = (req: Request, res: Response, next: NextFunction) => {
    Logger.logger.info(`${req.method} ${req.url}`);

    next();
  };
}

export default Logger;
