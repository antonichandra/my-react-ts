import { useState, useCallback } from 'react';

export interface FormData<T> {
  data: T;
  error: Partial<Record<keyof T, string>>;
}

export interface UseFormDataReturn<T> {
  formData: FormData<T>;
  setData: React.Dispatch<React.SetStateAction<T>>;
  setError: (field: keyof T, message: string | undefined) => void;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  reset: () => void;
  setFieldValue: (field: keyof T, value: unknown) => void;
}

/**
 * Custom hook for managing form data with typed fields and errors
 * @param initialData - Optional initial form data
 * @returns Object with form data, error handling, and utility functions
 */
export function useFormData<T extends object>(initialData?: Partial<T>): UseFormDataReturn<T> {
  const [data, setData] = useState<T>((initialData || {}) as T);
  const [error, setErrorState] = useState<Partial<Record<keyof T, string>>>({} as Partial<Record<keyof T, string>>);

  const setError = useCallback((field: keyof T, message: string | undefined) => {
    setErrorState((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const handleChange = useCallback((field: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error when user starts typing
      const currentError = error[field];
      if (currentError) {
        setError(field, undefined);
      }
    };
  }, [error, setError]);

  const reset = useCallback(() => {
    setData({} as T);
    setErrorState({} as Partial<Record<keyof T, string>>);
  }, []);

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setData((prev) => ({
      ...prev,
      [field]: value as T[keyof T],
    }));
  }, []);

  return {
    formData: { data, error },
    setData,
    setError,
    handleChange,
    reset,
    setFieldValue,
  };
}

