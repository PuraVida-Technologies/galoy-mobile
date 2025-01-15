import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SettingsRow } from "../row"
import { useSettingsScreenQuery } from "@app/graphql/generated"
import { useMemo } from "react"
import { color } from "@app/modules/market-place/theme"

export const KYC: React.FC = () => {
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { data, loading } = useSettingsScreenQuery()

  const subtitleColor = useMemo(() => {
    switch (data?.me?.kyc?.status) {
      case "PENDING":
        return color.palette.orange
      case "APPROVED":
        return color.palette.green
      case "REJECTED":
        return color.palette.red

      default:
        break
    }
  }, [data?.me?.kyc?.status])

  return (
    <SettingsRow
      shorter
      title={LL.common.KYC()}
      leftIcon="verified-user"
      subtitle={data?.me?.kyc?.status}
      subtitleStyles={{ textTransform: "capitalize", color: subtitleColor }}
      iconType="material"
      action={() => navigate("KYCScreen")}
      disabled={data?.me?.kyc?.status === "APPROVED"}
    />
  )
}
