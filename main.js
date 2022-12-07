const WebSocket = require("ws")
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
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
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

const startSocketReader = async (url, info_type) => {
  let socket = new WebSocket(url);
  logger.log('info', `           Attempting Connection to ${url}...`);


  socket.onmessage = (msg) => {
    let data = JSON.parse(msg.data)
    if (data?.data?.message == "lastBlock") {
      logger.log(info_type, "         Last synced block             network: " + (data.data.log.NetworkIn.string || data.data.log.NetworkOut.string).toString() + " | block: " + data.data.log.Block.toLocaleString());
    } else if (data?.data?.status == 'Fulfilled bridge in -> out request' || data?.data?.status == 'Marked bridge request complete') {
      if (data.data.error != "") {
        logger.log(info_type,
          "         Executing bridge error        method: " + data.data.log.Method.toString() +
          " | error: " + data.data.error.toString() +
          " | networkIn: " + data.data.log.NetworkIn.string.toString() +
          " | networkOut: " + data.data.log.NetworkOut.string.toString()
        );
      } else {
        logger.log(info_type,
          "         Executing bridge successful   method: " + data.data.log.Method.toString() +
          " | networkIn: " + data.data.log.NetworkIn.string.toString() +
          " | networkOut: " + data.data.log.NetworkOut.string.toString() +
          " | asset: " + "WAVAX" +
          " | user: " + "Harrison Hesslink" +
          " | amount: " + (data.data.log.Amount / (10 ** 18)).toString()
        );
      }
    } else if (data?.data?.status == "new event") {
      logger.log("bridge_pending",
        " New event pending" +
        "             status: " + data?.data?.message +
        " | networkIn: " + data.data.log.NetworkIn.string.toString() +
        " | networkOut: " + data.data.log.NetworkOut.string.toString()
      );
    } else if (data?.data?.status == "verified event") {
      logger.log("bridge_verified",
        "New event verified " +
        "           status: " + data?.data?.message +
        " | networkIn: " + data.data.log.NetworkIn.string.toString() +
        " | networkOut: " + data.data.log.NetworkOut.string.toString()
      );
    } else if (data?.data?.status == "kyc status request") {
      logger.log("kyc",
        "            New KYC status request " +
        "       status: " + data?.data?.message +
        " | walletAddress: " + data.data.walletAddress.toString()
      );
    } else if (data?.data?.status == "kyc request") {
      logger.log("kyc",
        "            New KYC request " +
        "              status: " + data?.data?.message +
        " | walletAddress: " + data?.data?.walletAddress
      );
    } else if (data?.data?.status == "checking queue") {
      logger.log("kyc",
        "            Handling kyc queue " +
        "           status: " + data?.data?.message +
        " | queue size: " + data?.data?.queue_size
      );
    } else if (data?.data?.status == "subaccount request") {
      logger.log("kyc",
        "            New KYC request " +
        "              status: " + data?.data?.message +
        " | parent: " + data?.data?.parent +
        " | parent: " + data?.data?.subaccount
      );
    } else if (data?.status != "pong") {
      logger.log('info', `           status: ${data?.status}`);

    }
  }

  socket.onopen = () => {
    socket.send("logs")
    setInterval(() => {
      socket.send('ping')
    }, 5000)
  };

  socket.onclose = event => {
    logger.log('info', "Socket Closed");
    socket.send("Client Closed!")
  };

  socket.onerror = error => {
    logger.log('info', "Socket Error", error);
  };
}

startSocketReader("ws://35.84.247.233/ws", "bridge")
startSocketReader("wss://kyc-testnet.thepuffin.network/ws", "verification")
