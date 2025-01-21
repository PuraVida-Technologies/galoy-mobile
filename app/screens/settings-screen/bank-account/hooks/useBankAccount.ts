import { useCallback } from "react"
import { useForm } from "react-hook-form"

const defaultValues = {
  accountHolderName: "",
  bankName: "",
  currency: "",
  swiftCode: "",
  iban: "",
  snipeCode: "",
}

const useBankAccount = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: { ...defaultValues },
  })

  const onSubmit = useCallback((data) => {}, [])

  return {
    state: {
      control,
    },
    actions: {
      handleSubmit,
      onSubmit,
    },
  }
}

export default useBankAccount
