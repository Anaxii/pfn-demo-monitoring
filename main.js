const WebSocket = require("ws")

const logger = require("./src/log").logger
const handleMessage = require("./src/handleMessage").handleMessage

const startSocketReader = async (url) => {
  let socket = new WebSocket(url);
  logger.log('info', `           Attempting Connection to ${url}...`);

  socket.onmessage = async (msg) => {
    let data = JSON.parse(msg.data)
    handleMessage(data)
  }

  socket.onopen = () => {
    socket.send("logs")
    setInterval(() => {
      socket.send('ping')
    }, 5000)
  };

  socket.onclose = event => {
    logger.log('info', "Socket Closed");
    socket.send("close")
  };

  socket.onerror = error => {
    logger.log('info', "Socket Error", error);
  };
}

startSocketReader("ws://35.84.247.233/ws")
startSocketReader("wss://kyc-testnet.thepuffin.network/ws")
