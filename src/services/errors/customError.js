import errorsDictionary from "./errors-dictionary.js";

class CustomError extends Error {
  constructor(errorCode, additionalInfo) {
    super(getErrorMessage(errorCode) || "Error desconocido");
    this.errorCode = errorCode;
    this.additionalInfo = additionalInfo;
  }
}

function getErrorMessage(errorCode) {
  switch (errorCode) {
    case errorsDictionary.ROUTING_ERROR:
      return "Error de enrutamiento";
    case errorsDictionary.INVALID_TYPES_ERROR:
      return "Error de tipos inválidos";
    case errorsDictionary.DATABASE_ERROR:
      return "Error de base de datos";
    case errorsDictionary.PRODUCT_NOT_FOUND_ERROR:
      return "Producto no encontrado";
    default:
      return "Error desconocido";
  }
}

export default CustomError;
