const winston = require("winston");
const chalk = require("chalk");
const morgan = require("morgan");

const { combine, timestamp, printf, colorize } = winston.format;

/* -----------------------------------------
   WINSTON LOGGER (with chalk formatting)
----------------------------------------- */

const logFormat = printf(({ level, message, timestamp }) => {
  return `${chalk.gray(timestamp)} ${chalk.cyan(`[${level}]`)}: ${chalk.white(
    message
  )}`;
});

const logger = winston.createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info",
    }),
  ],
});

// Expose helpful methods
logger.info = (msg) => logger.log({ level: "info", message: msg });
logger.error = (msg) => logger.log({ level: "error", message: msg });
logger.warn = (msg) => logger.log({ level: "warn", message: msg });
logger.debug = (msg) => logger.log({ level: "debug", message: msg });

/* -----------------------------------------
   MORGAN HTTP LOGGER (IP + User-Agent)
----------------------------------------- */

// Custom Morgan tokens
morgan.token("ip", (req) => req.ip || req.headers["x-forwarded-for"]);
morgan.token("user-agent", (req) => req.headers["user-agent"]);
morgan.token("timestamp", () => new Date().toISOString());

const morganFormat =
  ':timestamp :ip ":method :url" :status :response-time ms ":user-agent"';

// Stream Morgan logs into Winston
const httpLogger = morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

/* -----------------------------------------
   EXPORT BOTH
----------------------------------------- */

module.exports = { logger, httpLogger };
