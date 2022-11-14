const winston = require("winston");

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            prettyPrint: false,
            level: "info",
            silent: false,
            colorize: true,
            timestamp: true,
            filename: "log.log",
        }),
        new winston.transports.Console({
            level: "trace",
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: false,
        }),
    ],
});

module.exports = logger;
