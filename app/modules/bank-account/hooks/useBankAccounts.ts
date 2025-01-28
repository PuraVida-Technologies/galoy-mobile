import { gql } from "@apollo/client"
import {
  useBankAccountsQuery,
  useRemoveMyBankAccountMutation,
} from "@app/graphql/generated"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useCallback, useEffect } from "react"
import { Alert } from "react-native"
import crashlytics from "@react-native-firebase/crashlytics"

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
          accountHolderName
          nationalId
          iban
          sinpeCode
          swiftCode
          currency
        }
      }
    }
  }
`

const useBankAccounts = ({ LL }) => {
  const navigation = useNavigation()
  const { data, loading, error } = useBankAccountsQuery({ fetchPolicy: "network-only" })
  const [removeBankAccountCr, { loading: removingAccount }] =
    useRemoveMyBankAccountMutation({ refetchQueries: ["bankAccounts"] })
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!loading && data?.getMyBankAccounts?.length === 0) {
      navigate("bankAccount")
    }
  }, [loading, data])

  const confirmRemoveBankAccount = useCallback((account) => {
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
          onPress: () => onRemove(account),
        },
      ],
    )
  }, [])

  const onRemove = useCallback(async (account) => {
    try {
      await removeBankAccountCr({
        variables: {
          bankAccountId: account.id,
        },
      })
    } catch (err) {
      if (err instanceof Error) {
        crashlytics().recordError(err)
      }
    }
  }, [])

  return {
    state: {
      data,
      loading,
    },
    actions: {
      confirmRemoveBankAccount,
    },
  }
}

export default useBankAccounts
