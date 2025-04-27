import { gql } from "@apollo/client"
import {
  BankAccountCr,
  useBankAccountsQuery,
  useRemoveMyBankAccountMutation,
} from "@app/graphql/generated"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useCallback, useEffect } from "react"
import { Alert } from "react-native"
import crashlytics from "@react-native-firebase/crashlytics"
import { TranslationFunctions } from "@app/i18n/i18n-types"

gql`
  mutation RemoveMyBankAccount($bankAccountId: String!) {
    removeMyBankAccount(bankAccountId: $bankAccountId) {
      ... on BankAccountCR {
        id
      }
    }
  }
`

gql`
  query bankAccounts {
    getMyBankAccounts {
      ... on BankAccountCR {
        id
        galoyUserId
        type
        countryCode
        data {
          bankName
          iban
          currency
        }
      }
    }
  }
`

interface Props {
  LL: TranslationFunctions
}

const useBankAccounts = ({ LL }: Props) => {
  const { data, loading } = useBankAccountsQuery({ fetchPolicy: "network-only" })
  const [removeBankAccountCr, { loading: removingAccount }] =
    useRemoveMyBankAccountMutation({ refetchQueries: ["bankAccounts"] })
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!loading && data?.getMyBankAccounts?.length === 0) {
      navigate("bankAccount")
    }
  }, [loading, data])

  const confirmRemoveBankAccount = useCallback(
    (account: BankAccountCr, cb: () => void) => {
      Alert.alert(
        LL.BankAccountScreen.confirmRemoveBankAccountTitle(),
        LL.BankAccountScreen.confirmRemoveBankAccountContent(),
        [
          {
            text: LL.common.cancel(),
          },
          {
            text: LL.common.remove(),
            style: "destructive",
            onPress: () => onRemove(account, cb),
          },
        ],
      )
    },
    [],
  )

  const onRemove = useCallback(async (account: BankAccountCr, cb: () => void) => {
    try {
      await removeBankAccountCr({
        variables: {
          bankAccountId: account.id,
        },
      })
      cb()
    } catch (err) {
      if (err instanceof Error) {
        crashlytics().recordError(err)
      }
    }
  }, [])

  return {
    state: {
      data,
      loading: loading || removingAccount,
    },
    actions: {
      confirmRemoveBankAccount,
    },
  }
}

export default useBankAccounts
