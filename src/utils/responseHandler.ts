export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const successResponse = (message = 'success', data = null) => ({
  type: "success",
  message,
  data,
});

export const errorResponse = (message :String, loggedError : string | null = null) => ({
  type: "error",
  message,
  loggedError
}); 

export const returnError = (message: string, statusCode = 500) => {
    throw new AppError(message, statusCode);
};

export const sendSuccessResponse = (res : any, message = 'success', data : any | null = null, statusCode = 200) => {
    return res.status(statusCode).json(successResponse(message, data));
}

export const sendErrorResponse = (res : any, message : String, loggedError : string | null = null, statusCode = 500) => {

    return res.status(statusCode).json(errorResponse(message, loggedError));
}