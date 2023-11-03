const { createLogger, format, transports } = require("winston");

const apiLogger = createLogger({
  transports: new transports.File({
    filename: "logs/api.log",
    format: format.combine(
      format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      format.align(),
      format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
      )
    ),
  }),
});

const systemLogger = createLogger({
  transports: new transports.File({
    filename: "logs/system.log",
    format: format.combine(
      format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      format.align(),
      format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
      )
    ),
  }),
});

module.exports = {
  apiLogger,
  systemLogger
};
