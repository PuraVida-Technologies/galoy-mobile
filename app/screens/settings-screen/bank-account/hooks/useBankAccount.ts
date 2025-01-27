import { gql } from "@apollo/client"
import {
  useAddBankAccountCrMutation,
  useUpdateBankAccountCrMutation,
} from "@app/graphql/generated"
import { useCallback, useEffect } from "react"
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

gql`
  mutation UpdateBankAccountCR(
    $updateBankAccountCrId: String!
    $input: UpdateBankAccountCRDTO!
  ) {
    updateBankAccountCR(id: $updateBankAccountCrId, input: $input) {
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

const useBankAccount = ({ account }) => {
  const navigation = useNavigation()
  const [addBankAccountCr, { loading: addingAccount }] = useAddBankAccountCrMutation()
  const [updateBankAccountCr, { loading: updatingAccount }] =
    useUpdateBankAccountCrMutation()
  const { reset, getValues, handleSubmit, control } = useForm({
    defaultValues: { ...defaultValues },
  })

  useEffect(() => {
    if (account?.id) {
      const _defaultValues = {
        accountHolderName: account.data.accountHolderName,
        bankName: account.data.bankName,
        currency: account.data.currency,
        swiftCode: account.data.swiftCode,
        iban: account.data.iban,
        sinpeCode: account.data.sinpeCode,
        nationalId: account.data.nationalId,
      }
      reset({ ...getValues(), ..._defaultValues })
    }
  }, [account, getValues, reset])

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
      loading: addingAccount || updatingAccount,
    },
    actions: {
      handleSubmit,
      onSubmit,
    },
  }
}

export default useBankAccount
