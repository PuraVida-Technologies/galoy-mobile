import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SettingsRow } from "../row"
import { useBankAccountsQuery, useSettingsScreenQuery } from "@app/graphql/generated"

export const BankAccount: React.FC = () => {
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { data, loading } = useSettingsScreenQuery()
  const { data: bankAccounts, loading: checkingBankAccounts } = useBankAccountsQuery()

  return (
    <SettingsRow
      shorter
      title={LL.common.bankAccount()}
      leftIcon="bank-outline"
      iconType="material-community"
      loading={loading || checkingBankAccounts}
      action={() =>
        navigate(
          bankAccounts && bankAccounts?.getMyBankAccounts?.length > 0
            ? "bankAccounts"
            : "bankAccount",
        )
      }
      disabled={data?.me?.kyc?.status !== "APPROVED"}
    />
  )
}
