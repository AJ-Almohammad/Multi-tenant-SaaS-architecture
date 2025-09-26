import { APIResponse } from "../types";

export class ResponseHelper {
  static success(data: any, statusCode: number = 200): APIResponse {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({
        success: true,
        data,
      }),
    };
  }

  static error(message: string, statusCode: number = 400, details?: any): APIResponse {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({
        success: false,
        error: {
          message,
          details,
        },
      }),
    };
  }

  static unauthorized(message: string = "Unauthorized"): APIResponse {
    return this.error(message, 401);
  }

  static notFound(message: string = "Resource not found"): APIResponse {
    return this.error(message, 404);
  }
}
