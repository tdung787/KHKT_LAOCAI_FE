// utils/errorHandler.ts
import { AxiosError } from 'axios';
import { IApiError } from './IError';
import toast from 'react-hot-toast';

export const handleApiError = (error: unknown): IApiError => {
  if (error instanceof AxiosError && error.response) {
    const apiError = error.response.data as IApiError;
    
    // Hiển thị toast cho từng lỗi validation
    if (apiError.errors && apiError.errors.length > 0) {
      apiError.errors.forEach((err) => {
        toast.error(`${err.field}: ${err.message}`);
      });
    } else {
      toast.error(apiError.message || 'Có lỗi xảy ra');
    }
    
    return apiError;
  }

  // Lỗi không xác định
  const defaultError: IApiError = {
    success: false,
    message: 'Có lỗi xảy ra, vui lòng thử lại',
    statusCode: 500,
  };
  
  toast.error(defaultError.message);
  return defaultError;
};

 export const handleApiErrorAuth= (error: unknown): IApiError => {
  if (error instanceof AxiosError && error.response) {
    const apiError = error.response.data as IApiError;
    return apiError;
  }

  // Lỗi không xác định
  const defaultError: IApiError = {
    success: false,
    message: 'Có lỗi xảy ra, vui lòng thử lại',
    statusCode: 500,
  };
  
  return defaultError;
};

// Format error message cho UI
export const getErrorMessage = (error: IApiError): string => {
  if (error.errors && error.errors.length > 0) {
    return error.errors.map(e => e.message).join(', ');
  }
  return error.message;
};

// Get error by field (cho form validation)
export const getFieldError = (error: IApiError | null, fieldName: string): string | undefined => {
  if (!error?.errors) return undefined;
  const fieldError = error.errors.find(e => e.field === fieldName);
  return fieldError?.message;
};