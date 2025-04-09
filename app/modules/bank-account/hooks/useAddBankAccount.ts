import { gql } from "@apollo/client"
import {
  BankAccountCr,
  useAddBankAccountCrMutation,
  useUpdateBankAccountCrMutation,
} from "@app/graphql/generated"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import crashlytics from "@react-native-firebase/crashlytics"
import { useNavigation } from "@react-navigation/native"
import { TranslationFunctions } from "@app/i18n/i18n-types"

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

interface Props {
  account?: BankAccountCr
  LL: TranslationFunctions
}

const defaultValues = {
  accountHolderName: "",
  bankName: "",
  currency: "",
  swiftCode: "",
  iban: "",
  sinpeCode: "",
  nationalId: "",
}

const useAddBankAccount = ({ account, LL }: Props) => {
  const navigation = useNavigation()
  const [addBankAccountCr, { loading: addingAccount }] = useAddBankAccountCrMutation({
    refetchQueries: ["bankAccounts"],
  })
  const [updateBankAccountCr, { loading: updatingAccount }] =
    useUpdateBankAccountCrMutation({ refetchQueries: ["bankAccounts"] })

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
        iban: "",
        sinpeCode: account.data.sinpeCode,
        nationalId: "",
        id: account.id,
      }
      reset({ ...getValues(), ..._defaultValues })
    }
  }, [account, getValues, reset])

  const onSubmit = useCallback(async (data) => {
    try {
      if (data.id) {
        const _data = { ...data }
        delete _data.id
        await updateBankAccountCr({
          variables: {
            updateBankAccountCrId: data.id,
            input: { ..._data },
          },
        })
      } else {
        await addBankAccountCr({
          variables: {
            input: { ...data },
          },
        })
      }
      navigation.goBack()
      reset({ ...defaultValues })
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

export default useAddBankAccount
