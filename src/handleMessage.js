const logger = require("./log").logger

const handleMessage = async (data) => {
  if (data?.data?.message == "lastBlock") {
    logger.log(
      "bridge", "         Last synced block             network: " +
      (data.data.log.NetworkIn.string || data.data.log.NetworkOut.string).toString() +
      " | block: " + data.data.log.Block.toLocaleString()
    );
  } else if (data?.data?.status == 'Fulfilled bridge in -> out request' || data?.data?.status == 'Marked bridge request complete') {
    if (data.data.error != "") {
      logger.log("bridge",
        "         Executing bridge error        method: " + data.data.log.Method.toString() +
        " | error: " + data.data.error.toString() +
        " | networkIn: " + data.data.log.NetworkIn.string.toString() +
        " | networkOut: " + data.data.log.NetworkOut.string.toString()
      );
    } else {
      logger.log("bridge",
        "         Executing bridge successful   method: " + data.data.log.Method.toString() +
        " | networkIn: " + data.data.log.NetworkIn.string.toString() +
        " | networkOut: " + data.data.log.NetworkOut.string.toString() +
        " | asset: " + "WAVAX" +
        " | user: " + "Harrison Hesslink" +
        " | amount: " + (data.data.log.Amount / (10 ** 18)).toString()
      );
    }
  } else if (data?.data?.status == "new event") {
    // console.log(data)
    if (data?.data?.log?.Method == "BridgeIn")
      logger.log("bridge_pending",
        " Travel rule log" +
        "               token: " + "WAVAX" +
        " | networkIn: " + data.data.log.NetworkIn.string.toString() +
        " | networkOut: " + data.data.log.NetworkOut.string.toString()
      );
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

module.exports = {handleMessage}
