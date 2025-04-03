import React from "react"
import { Text, Divider } from "@rneui/themed"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { View } from "react-native"
import Stepper from "./stepper"
import RadioGroup from "@app/components/radio-input/radio-input-group"
import { Route } from "./hooks/useKYCState"
import useConfirmKYC from "./hooks/useConfirmKYC"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { palette } from "@app/theme/palette"

const radioGroup = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no", style: { marginLeft: 10 } },
]

const ConfirmDisclosures = ({ jumpTo, route }: Route) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { state, actions } = useConfirmKYC({
    state: route.state,
    setState: route.setState,
  })

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.confirmDisclosures()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <View>
          <Text type="p2" style={styles.disclosuresText}>
            {LL.KYCScreen.labels.PEP()}
          </Text>
          <RadioGroup
            group={radioGroup}
            value={state.isPoliticallyExposed}
            onChange={actions?.onPepChange}
          />
        </View>
        <View>
          <Text type="p2" style={styles.disclosuresText}>
            {LL.KYCScreen.labels.MoneyTransfers()}
          </Text>
          <RadioGroup
            group={radioGroup}
            value={state.isHighRisk}
            onChange={actions?.onHighRiskChange}
          />
        </View>
      </View>
      <Stepper
        jumpTo={jumpTo}
        previous
        nextTitle={LL.common.confirm()}
        previousPage={"user"}
        disableNext={state.loading}
        allowNext={!state.loading}
        onNext={() => actions?.onConfirm()}
      />
      <LoadingComponent
        isLoading={state.loading}
        color={palette.coolGrey}
        styles={{ backgroundColor: palette.lightWhite }}
      />
    </>
  )
}

export default ConfirmDisclosures
