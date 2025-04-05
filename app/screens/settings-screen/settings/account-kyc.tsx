import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SettingsRow } from "../row"
import { useKycDetailsQuery, Status } from "@app/graphql/generated"
import { useMemo } from "react"
import { color } from "@app/modules/market-place/theme"

export const KYC: React.FC = () => {
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { data, loading } = useKycDetailsQuery({ fetchPolicy: "network-only" })

  const awaitingApproval = useMemo(() => {
    const kyc = data?.me?.kyc
    if (!loading) {
      return (
        Boolean(
          kyc?.primaryIdentification?.type &&
            kyc?.primaryIdentification?.files &&
            kyc?.primaryIdentification?.files?.length > 0 &&
            kyc?.phoneNumber &&
            kyc?.email &&
            kyc?.gender &&
            kyc?.isPoliticallyExposed?.toString() &&
            kyc?.isHighRisk?.toString(),
        ) && kyc?.status !== Status.Approved
      )
    }
    return false
  }, [data?.me?.kyc, loading])

  const subtitleColor = useMemo(() => {
    switch (data?.me?.kyc?.status) {
      case Status.Pending:
        return color.palette.orange
      case Status.Approved:
        return color.palette.green
      case Status.Rejected:
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
      subtitle={awaitingApproval ? "Awaiting Approval" : data?.me?.kyc?.status}
      subtitleStyles={{ textTransform: "capitalize", color: subtitleColor }}
      iconType="material"
      action={() => navigate("KYCScreen")}
      disabled={
        loading || awaitingApproval || ["APPROVED"].includes(data?.me?.kyc?.status || "")
      }
    />
  )
}
