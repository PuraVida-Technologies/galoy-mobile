import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SettingsRow } from "../row"

export const KYC: React.FC = () => {
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <SettingsRow
      shorter
      title={LL.common.KYC()}
      leftIcon="verified-user"
      iconType="material"
      action={() => navigate("KYCScreen")}
    />
  )
}
