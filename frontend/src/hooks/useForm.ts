import { useState } from 'react';

export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [id]: value, // Cập nhật field dựa trên 'id' của Input
    }));
  };

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, resetForm };
}
