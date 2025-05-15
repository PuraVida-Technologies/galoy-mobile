import React from "react"
import { Modal, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { WalletCurrency } from "@app/graphql/generated"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { RouteProp } from "@react-navigation/native"
import useStyles from "./styles/snipe-confirmation"
import useSinpeConfirmation from "./hooks/useSinpeWithdrawalConfirmation"
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers"
import {
  CompletedTextAnimation,
  SuccessIconAnimation,
} from "@app/components/success-animation"
import { GaloyIcon } from "@app/components/atomic/galoy-icon"
import { testProps } from "@app/utils/testProps"
import { Text } from "@rneui/themed"
import SinpeInfoFieldPVAccount from "./components/sinpe-info-field-pv-account"

type Props = {
  route: RouteProp<RootStackParamList, "sinpeConfirmation">
}

export const SinpeIBANWithdrawConfirmationScreen: React.FC<Props> = ({ route }) => {
  const styles = useStyles()

  const { state, actions } = useSinpeConfirmation({ route })

  const {
    LL,
    fromWalletCurrency,
    bankAccount,
    fromAccountBalance,
    isLoading,
    canWithdraw,
    fiatSymbol,
  } = state

  if (
    !state.data?.me ||
    !state.usdWallet ||
    !state.btcWallet ||
    !actions.convertMoneyAmount
  ) {
    // TODO: handle errors and or provide some loading state
    return null
  }

  return (
    <Screen>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.snipeInfoCard}>
          <SinpeInfoFieldPVAccount
            sinpeInfoFieldTitle={LL.common.from()}
            fromWalletCurrency={fromWalletCurrency}
            fromAccountBalance={fromAccountBalance}
          />
          <View style={styles.snipeInfoField}>
            <Text style={styles.snipeInfoFieldTitle}>{LL.common.toBankAccount()}</Text>
            <Text style={styles.snipeInfoFieldValue}>{bankAccount.accountAlias}</Text>
            <Text style={styles.snipeInfoSubFieldValue}>{bankAccount.iban}</Text>
          </View>
          <View>
            <Text style={styles.snipeInfoFieldTitle}>
              {LL.SnipeConfirmationScreen.amount()}
            </Text>
            <View style={styles.flexRow}>
              <Text style={styles.snipeInfoFieldValue}>{fiatSymbol} </Text>
              <AnimatedRollingNumber
                value={Number(state?.sellAmount)}
                useGrouping
                compactToFixed={2}
                textStyle={styles.snipeInfoFieldValue}
              />
              <Text style={styles.snipeInfoFieldValue}></Text>
            </View>
            {state.fromWalletCurrency === WalletCurrency.Btc && (
              <View style={styles.flexRow}>
                <Text style={styles.snipeInfoFieldTitle}>At {fiatSymbol}</Text>
                <AnimatedRollingNumber
                  value={Number(state?.btcPrice)}
                  useGrouping
                  compactToFixed={2}
                  textStyle={styles.snipeInfoFieldTitle}
                />
                <Text style={styles.snipeInfoFieldTitle}> / BTC</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.snipeInfoCard, styles.totalAmountContainer]}>
        <View>
          <Text style={styles.snipeInfoFieldValue}>{LL.common.total()}</Text>

          <View style={styles.sellAmount}>
            <Text style={styles.snipeInfoFieldTitle}>
              {LL.common.includes().slice(0, 3)}. {fiatSymbol}
            </Text>
            <AnimatedRollingNumber
              value={Number(state.feesAmount)}
              useGrouping
              compactToFixed={2}
              textStyle={styles.snipeInfoFieldTitle}
            />
            <Text style={styles.snipeInfoFieldTitle}> {LL.common.fee()}</Text>
          </View>
        </View>
        <View style={styles.sellAmount}>
          <Text style={styles.snipeInfoFieldValue}> {fiatSymbol}</Text>
          <AnimatedRollingNumber
            value={Number(state.totalAmount)}
            useGrouping
            compactToFixed={2}
            textStyle={styles.snipeInfoFieldValue}
          />
        </View>
      </View>
      <GaloyPrimaryButton
        title={LL.common.withdraw()}
        containerStyle={styles.buttonContainer}
        disabled={isLoading || !canWithdraw}
        onPress={actions?.onWithdraw}
        loading={isLoading}
      />
      <Modal visible={state.success}>
        <View style={styles.container}>
          <SuccessIconAnimation>
            <GaloyIcon name={"payment-success"} size={128} />
          </SuccessIconAnimation>

          <CompletedTextAnimation>
            <Text {...testProps("Success Text")} style={styles.completedText}>
              {LL.SendBitcoinScreen.success()}
            </Text>
          </CompletedTextAnimation>
          <GaloyPrimaryButton
            title={LL.common.backHome()}
            containerStyle={styles.paymentSuccessBtn}
            disabled={isLoading}
            onPress={actions?.navigateToHomeScreen}
            loading={isLoading}
          />
        </View>
      </Modal>
    </Screen>
  )
}
