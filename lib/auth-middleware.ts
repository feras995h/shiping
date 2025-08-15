import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { ApiResponseHandler } from './api-response';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  return user;
}

export async function requireAdmin() {
  return requireRole(['ADMIN']);
}

export async function requireManager() {
  return requireRole(['ADMIN', 'MANAGER']);
}

export function withAuth(handler: Function) {
  return async (request: Request) => {
    try {
      const user = await requireAuth();
      return handler(request, user);
    } catch (error) {
      return ApiResponseHandler.unauthorized();
    }
  };
}

export function withRole(allowedRoles: string[]) {
  return (handler: Function) => {
    return async (request: Request) => {
      try {
        const user = await requireRole(allowedRoles);
        return handler(request, user);
      } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
          return ApiResponseHandler.unauthorized();
        }
        return ApiResponseHandler.forbidden();
      }
    };
  };
} 