import errorsDictonary from "../errors-dictionary.js";

const errorMiddleware = (error, req, res, next) => {
  req.logger.error("Error detectado entrando al Error Middleware:");
  req.logger.error(`Name: ${error.name}`);
  req.logger.error(`Code: ${error.errorCode}`);
  req.logger.error(`Message: ${error.message}`);

  if (error.additionalInfo) {
    req.logger.error("Additional Info:", error.additionalInfo);
  }

  switch (error.errorCode) {
    case errorsDictonary.INVALID_TYPES_ERROR:
      res.status(400).json({ status: "error", error: error.message });
      break;
    case errorsDictonary.PRODUCT_NOT_FOUND_ERROR:
      res.status(404).json({ status: "error", error: error.message });
      break;
    default:
      res.status(500).json({ status: "error", error: "Unhandled error!" });
  }
};

export default errorMiddleware;
