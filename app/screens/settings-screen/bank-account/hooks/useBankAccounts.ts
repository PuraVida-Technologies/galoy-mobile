import { gql } from "@apollo/client"
import { useBankAccountsQuery } from "@app/graphql/generated"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useEffect } from "react"

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

const useBankAccounts = () => {
  const { data, loading, error } = useBankAccountsQuery()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!loading && data?.getMyBankAccounts?.length === 0) {
      navigate("bankAccount")
    }
  }, [loading, data])

  return {
    state: {
      data,
      loading,
    },
    actions: {},
  }
}

export default useBankAccounts
