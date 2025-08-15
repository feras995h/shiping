
import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export class ApiResponseHandler {
  static success<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message
    });
  }

  static created<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message: message || 'تم الإنشاء بنجاح'
    }, { status: 201 });
  }

  static badRequest(message: string, error?: string): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      message,
      error
    }, { status: 400 });
  }

  static unauthorized(message?: string): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      message: message || 'غير مصرح لك بالوصول'
    }, { status: 401 });
  }

  static forbidden(message?: string): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      message: message || 'ليس لديك صلاحية للوصول'
    }, { status: 403 });
  }

  static notFound(message?: string): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      message: message || 'المورد غير موجود'
    }, { status: 404 });
  }

  static serverError(message?: string, error?: string): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      message: message || 'خطأ في الخادم',
      error
    }, { status: 500 });
  }

  static validationError(errors: string[]): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      error: errors.join(', ')
    }, { status: 422 });
  }
}
