import { NextResponse } from 'next/server';
import { ApiResponse } from './validations';

export class ApiResponseHandler {
  static success<T>(data: T, message?: string, status = 200) {
    const response: ApiResponse = {
      success: true,
      message,
      data,
    };
    return NextResponse.json(response, { status });
  }

  static error(message: string, status = 400, error?: string) {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    return NextResponse.json(response, { status });
  }

  static notFound(message = 'Resource not found') {
    return this.error(message, 404);
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return this.error(message, 403);
  }

  static serverError(message = 'Internal server error') {
    return this.error(message, 500);
  }

  static validationError(errors: string[]) {
    return this.error('Validation failed', 400, errors.join(', '));
  }
} 