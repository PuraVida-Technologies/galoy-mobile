import { gql } from "@apollo/client"
import { useAddBankAccountCrMutation } from "@app/graphql/generated"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import crashlytics from "@react-native-firebase/crashlytics"
import { useNavigation } from "@react-navigation/native"

gql`
  mutation addBankAccountCR($input: AddBankAccountCRDTO!) {
    addBankAccountCR(input: $input) {
      id
    }
  }
`

const defaultValues = {
  accountHolderName: "",
  bankName: "",
  currency: "",
  swiftCode: "",
  iban: "",
  sinpeCode: "",
  nationalId: "",
}

const useBankAccount = () => {
  const navigation = useNavigation()
  const [addBankAccountCr, { loading }] = useAddBankAccountCrMutation()
  const { handleSubmit, control } = useForm({
    defaultValues: { ...defaultValues },
  })

  const onSubmit = useCallback(async (data) => {
    console.log(data)
    try {
      await addBankAccountCr({
        variables: {
          input: { ...data },
        },
      })
      navigation.goBack()
    } catch (err) {
      if (err instanceof Error) {
        crashlytics().recordError(err)
      }
    }
  }, [])

  return {
    state: {
      control,
      loading,
    },
    actions: {
      handleSubmit,
      onSubmit,
    },
  }
}

export default useBankAccount
