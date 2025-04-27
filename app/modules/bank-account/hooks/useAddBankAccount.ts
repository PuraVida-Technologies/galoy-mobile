import { gql } from "@apollo/client"
import {
  BankAccountCr,
  useAddBankAccountCrMutation,
  useVerifyIbanAccountLazyQuery,
} from "@app/graphql/generated"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import crashlytics from "@react-native-firebase/crashlytics"
import { useNavigation } from "@react-navigation/native"
import { TranslationFunctions } from "@app/i18n/i18n-types"

gql`
  query VerifyIbanAccount($iban: String!) {
    verifyIbanAccount(iban: $iban) {
      success
      iban
      bankName
      alias
      currencyCode
      errorCode
      message
    }
  }
`

gql`
  mutation addBankAccountCR($input: AddBankAccountCRDTO!) {
    addBankAccountCR(input: $input) {
      id
      galoyUserId
      type
      countryCode
      accountAlias
      data {
        bankName
        iban
        currency
      }
    }
  }
`

interface Props {
  account?: BankAccountCr
  LL: TranslationFunctions
}

type BankAccountForm = {
  iban: string
  accountAlias: string
}

const defaultValues: BankAccountForm = {
  iban: "",
  accountAlias: "",
}

const useAddBankAccount = ({ LL }: Props) => {
  const navigation = useNavigation()
  const [verifyIbanAccount, { loading: verifying }] = useVerifyIbanAccountLazyQuery()
  const [addBankAccountCr, { loading: addingAccount }] = useAddBankAccountCrMutation({
    refetchQueries: ["bankAccounts"],
  })

  const { reset, handleSubmit, control, setValue, getValues } = useForm<BankAccountForm>({
    defaultValues: { ...defaultValues },
  })

  const [bankDetails, setBankDetails] = useState<{
    bankName?: string
    iban?: string
    currencyCode?: string
  } | null>(null)

  const verifyIban = useCallback(async (iban: string) => {
    try {
      const { data } = await verifyIbanAccount({ variables: { iban } })
      const result = data?.verifyIbanAccount
      if (result?.success) {
        setBankDetails({
          bankName: result?.bankName ?? undefined,
          iban: result?.iban ?? undefined,
          currencyCode: result?.currencyCode ?? undefined,
        })
        setValue(
          "accountAlias",
          `${result.currencyCode}-${(result.iban ?? "").slice(-4)}`,
        )
      } else {
        throw new Error(result?.message || LL.BankAccountScreen.verifyIbanError())
      }
    } catch (error) {
      if (error instanceof Error) {
        crashlytics().recordError(error)
      }
      throw error
    }
  }, [])

  const addBankAccount = useCallback(
    async (data: BankAccountForm) => {
      try {
        const input = {
          accountAlias: data.accountAlias,
          bankName: bankDetails?.bankName || "",
          currency: bankDetails?.currencyCode,
          iban: bankDetails?.iban,
        }
        await addBankAccountCr({ variables: { input } })
        navigation.goBack()
        reset({ ...defaultValues })
      } catch (err) {
        crashlytics().recordError(err)
        throw err
      }
    },
    [bankDetails],
  )

  const onSubmit = useCallback(async (data: BankAccountForm) => {
    try {
      await addBankAccountCr({
        variables: {
          input: { ...data },
        },
      })

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
      loading: verifying || addingAccount,
      bankDetails,
      getValues,
      setValue,
    },
    actions: {
      handleSubmit,
      verifyIban,
      addBankAccount,
      onSubmit,
    },
  }
}

export default useAddBankAccount
