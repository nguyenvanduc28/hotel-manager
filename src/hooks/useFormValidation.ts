import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: {
    validate: (value: any) => boolean;
    message: string;
  }[];
}

interface UseFormValidationReturn {
  errors: { [key: string]: string };
  validateForm: (data: any) => boolean;
  confirmSave: (callback: () => Promise<void>) => Promise<void>;
  clearErrors: () => void;
}

export const useFormValidation = (
  validationRules: ValidationRules
): UseFormValidationReturn => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = useCallback(
    (data: any): boolean => {
      const newErrors: { [key: string]: string } = {};
      
      Object.keys(validationRules).forEach((field) => {
        const fieldRules = validationRules[field];
        const value = data[field];

        for (const rule of fieldRules) {
          if (!rule.validate(value)) {
            newErrors[field] = rule.message;
            break;
          }
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [validationRules]
  );

  const confirmSave = useCallback(async (callback: () => Promise<void>) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn lưu thay đổi?');
    if (confirmed) {
      try {
        await callback();
      } catch (error) {
        console.error('Lỗi khi lưu:', error);
        throw error;
      }
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validateForm, confirmSave, clearErrors };
}; 