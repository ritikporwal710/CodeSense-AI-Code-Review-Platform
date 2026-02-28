import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { format } from "winston";
import express from "express";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Get environment (development, production, staging)
const getEnvironment = (): string => {
  const env = process.env.NODE_ENV || "development";
  return env;
};

// Get environment prefix for log files
const getEnvironmentPrefix = (): string => {
  const env = process.env.NODE_ENV || "development";
  switch (env) {
    case "production":
      return "prod";
    case "staging":
      return "stag";
    case "development":
    default:
      return "dev";
  }
};

// Define log level based on environment
const level = () => {
  const env = getEnvironment();
  const configuredLevel = process.env.LOG_LEVEL;
  if (configuredLevel) {
    return configuredLevel;
  }
  return env === "development" ? "debug" : "info";
};

// Define structured log format
const structuredFormat = format((info) => {
  const timestamp = new Date().toISOString();
  const environment = getEnvironment();

  return {
    ...info,
    timestamp,
    service: "scs-backend",
    environment,
    severity: info.level.toUpperCase(),
    severityNumber: levels[info.level as keyof typeof levels] || 0,
  };
});

// Define console format
const consoleFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  format.colorize({ all: true }),
  format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}${
        info.splat !== undefined ? `${info.splat}` : ""
      }`,
  ),
);

// Define file format (JSON with structured logging)
const fileFormat = format.combine(
  structuredFormat(),
  format.timestamp(),
  format.json(),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: getEnvironment() === "development" ? consoleFormat : fileFormat,
  }),

  // Single rotating file transport for all logs
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, `${getEnvironmentPrefix()}-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: process.env.LOG_MAX_SIZE || "20m",
    maxFiles: process.env.LOG_MAX_FILES || "14d",
    format: fileFormat,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exitOnError: false,
});

// Add request context middleware for Express
export const requestLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Skip logging for health check and favicon
  if (["/health", "/favicon.ico"].some((path) => req.path.includes(path))) {
    return next();
  }

  // Add request information to logs
  const start = Date.now();

  // Log request
  logger.http(`${req.method} ${req.originalUrl}`, {
    requestId: req.headers["x-request-id"] || "",
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    // Log based on status code
    if (res.statusCode >= 500) {
      logger.error(message, {
        responseTime: duration,
        statusCode: res.statusCode,
      });
    } else if (res.statusCode >= 400) {
      logger.warn(message, {
        responseTime: duration,
        statusCode: res.statusCode,
      });
    } else {
      logger.info(message, {
        responseTime: duration,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

export default logger;
