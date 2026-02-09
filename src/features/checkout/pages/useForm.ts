import { useState, FormEvent } from 'react'
import { z } from 'zod'

interface UseFormProps<T> {
  initialValues: T
  schema: z.ZodSchema<T>
  onSubmit: (values: T) => void
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = (field: keyof T, value: unknown) => {
    const newValues = { ...values, [field]: value }
    setValues(newValues)
    
    // Validate immediately on change  
    validateField(field, newValues)
  }

  const validateField = (field: keyof T, valuesToValidate = values) => {
    try {
      schema.parse(valuesToValidate)
      // Field is valid, clear error
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === field)
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [field]: fieldError.message,
          }))
        } else {
          // No error for this specific field, clear it
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      }
    }
  }

  const handleBlur = (field: keyof T) => {
    // Only mark as touched, don't validate here
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validateAll = (): boolean => {
    try {
      schema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T
          newErrors[field] = err.message
        })
        setErrors(newErrors)
        
        // Mark all fields as touched
        const allTouched: Partial<Record<keyof T, boolean>> = {}
        Object.keys(values).forEach((key) => {
          allTouched[key as keyof T] = true
        })
        setTouched(allTouched)
      }
      return false
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validateAll()) {
      onSubmit(values)
    }
  }

  const setFieldValue = (field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    validateAll,
    reset,
  }
}
