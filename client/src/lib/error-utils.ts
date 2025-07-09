import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Types for API error responses
interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

// Type alias for AxiosError with our API error response
type ApiError = AxiosError<ApiErrorResponse>;

interface ErrorHandlerOptions {
  defaultMessage?: string;
  showToast?: boolean;
  customMessages?: Record<number, string>;
}

export const handleApiError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): string => {
  const {
    defaultMessage = 'An unexpected error occurred. Please try again.',
    showToast = true,
    customMessages = {},
  } = options;

  let errorMessage = defaultMessage;

  // Type guard to check if error is an AxiosError
  if (isAxiosError(error)) {
    const apiError = error as ApiError;

    // Check for custom messages first
    if (apiError.response?.status && customMessages[apiError.response.status]) {
      errorMessage = customMessages[apiError.response.status];
    }
    // Handle API response errors
    else if (apiError.response?.data?.message) {
      if (Array.isArray(apiError.response.data.message)) {
        // Handle validation errors array - take the first one
        errorMessage = apiError.response.data.message[0];
      } else {
        // Handle single error message
        errorMessage = apiError.response.data.message;
      }
    }
    // Handle specific HTTP status codes
    else if (apiError.response?.status) {
      switch (apiError.response.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = 'Conflict. This resource already exists.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = defaultMessage;
      }
    }
    // Handle network errors
    else if (apiError.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    // Handle timeout errors
    else if (apiError.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    }
  }

  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }

  return errorMessage;
};

// Type guard to check if error is an AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

// Specific error handlers for common scenarios
export const handleAuthError = (error: unknown): string => {
  return handleApiError(error, {
    defaultMessage: 'Authentication failed. Please try again.',
    customMessages: {
      401: 'Invalid credentials. Please check your email and password.',
      409: 'Email or username already exists. Please choose different ones.',
      422: 'Please check your input and try again.',
    },
  });
};

export const handleValidationError = (error: unknown): string => {
  return handleApiError(error, {
    defaultMessage: 'Please check your input and try again.',
    customMessages: {
      400: 'Invalid input. Please check your data.',
      422: 'Validation failed. Please correct the errors.',
    },
  });
};