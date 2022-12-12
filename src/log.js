const winston = require('winston');

const logger = winston.createLogger({
  levels: {
    info: 0,
    bridge: 1,
    bridge_pending: 2,
    bridge_verified: 3,
    kyc: 4,
    faucet: 5,
    incoming: 6,
    warn: 7,
    error: 8
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
  faucet: 'red',
  warn: 'orange',
  error: 'red'
});

module.exports = {logger}
