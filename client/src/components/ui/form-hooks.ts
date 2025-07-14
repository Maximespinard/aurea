import * as React from "react"
import { useFormContext, useFormState } from "react-hook-form"

const FormFieldContext = React.createContext<{ name: string } | undefined>(undefined)
const FormItemContext = React.createContext<{ id: string } | undefined>(undefined)

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })
  const fieldState = getFieldState(fieldContext?.name || "", formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext || { id: "" }

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

export { FormFieldContext, FormItemContext }