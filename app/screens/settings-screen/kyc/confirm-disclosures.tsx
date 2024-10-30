import { Text, Divider } from "@rneui/themed"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { View } from "react-native"
import Stepper from "./stepper"
import RadioGroup from "@app/components/radio-input/radio-input-group"
import { Route } from "./hooks/useKYCState"

const radioGroup = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no", style: { marginLeft: 10 } },
]

const ConfirmDisclosures = ({ jumpTo, route }: Route) => {
  const styles = useStyles()
  const { LL } = useI18nContext()

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.confirmDisclosures()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <View>
          <Text type="p2">{LL.KYCScreen.labels.PEP()}</Text>
          <RadioGroup
            group={radioGroup}
            value={route?.state?.pep}
            onChange={(value) => route?.setState({ pep: value })}
          />
        </View>
        <View>
          <Text type="p2">{LL.KYCScreen.labels.MoneyTransfers()}</Text>
          <RadioGroup
            group={radioGroup}
            value={route?.state?.moneyTransfers}
            onChange={(value) => route?.setState({ moneyTransfers: value })}
          />
        </View>
      </View>
      <Stepper
        jumpTo={jumpTo}
        pervious
        nextTitle={LL.common.confirm()}
        perviousPage={"user"}
        onNext={() => {}}
      />
    </>
  )
}

export default ConfirmDisclosures
