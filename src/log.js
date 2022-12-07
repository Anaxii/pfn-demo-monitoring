const winston = require('winston');

const logger = winston.createLogger({
  levels: {
    info: 0,
    bridge: 1,
    bridge_pending: 2,
    bridge_verified: 3,
    kyc: 4,
    incoming: 5,
    warn: 6,
    error: 7
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console({level: "error"}),
    // new winston.transports.File({filename: 'src/error.log', level: 'error'}),
    // new winston.transports.File({filename: 'combined.log'}),
  ],
});

winston.addColors({
  info: 'blue',
  bridge: 'green',
  bridge_pending: 'yellow',
  bridge_verified: 'green',
  kyc: 'magenta',
  warn: 'orange',
  error: 'red'
});

module.exports = {logger}
