import React from "react"
import { Modal, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { WalletCurrency } from "@app/graphql/generated"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency } from "@app/types/amounts"
import { RouteProp, useNavigation } from "@react-navigation/native"
import useStyles from "./styles/snipe-confirmation"
import useSnipeConfirmation from "./hooks/useSnipeConfirmation"
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers"
import {
  CompletedTextAnimation,
  SuccessIconAnimation,
} from "@app/components/success-animation"
import { GaloyIcon } from "@app/components/atomic/galoy-icon"
import { testProps } from "@app/utils/testProps"

type Props = {
  route: RouteProp<RootStackParamList, "snipeConfirmation">
}

export const SnipeConfirmationScreen: React.FC<Props> = ({ route }) => {
  const styles = useStyles()
  const { state, actions } = useSnipeConfirmation({ route })
  const navigation = useNavigation()

  const {
    LL,
    fromWalletCurrency,
    bankAccount,
    fromAccountBalance,
    toAmount,
    fromAmount,
    isLoading,
    errorMessage,
    fromWallet,
    toWallet,
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
          <View style={styles.snipeInfoField}>
            <Text style={styles.snipeInfoFieldTitle}>{LL.common.from()}</Text>
            <Text style={styles.snipeInfoFieldValue}>
              {fromWalletCurrency === WalletCurrency.Btc
                ? LL.common.btcAccount()
                : LL.common.usdAccount()}
            </Text>
            <Text style={styles.snipeInfoSubFieldValue}>{fromAccountBalance}</Text>
          </View>
          <View style={styles.snipeInfoField}>
            <Text style={styles.snipeInfoFieldTitle}>{LL.common.bankAccount()}</Text>
            <Text style={styles.snipeInfoFieldValue}>
              {bankAccount.accountHolderName}
            </Text>
            <Text style={styles.snipeInfoSubFieldValue}>{bankAccount.iban}</Text>
          </View>
          <View>
            <Text style={styles.snipeInfoFieldTitle}>
              {LL.SnipeConfirmationScreen.amount()}
            </Text>
            <Text style={styles.snipeInfoFieldValue}>
              {actions?.formatMoneyAmount({ moneyAmount: toAmount })} of bitcoin
            </Text>
            {state.fromWalletCurrency === WalletCurrency.Btc && (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.snipeInfoFieldTitle}>At $</Text>
                <AnimatedRollingNumber
                  value={Number(state?.btcPriceInUsd)}
                  useGrouping
                  compactToFixed={2}
                  textStyle={styles.snipeInfoFieldTitle}
                />
                <Text style={styles.snipeInfoFieldTitle}> / BTC</Text>
              </View>
            )}
            <View style={styles.sellAmountContainer}>
              <Text style={styles.snipeInfoFieldTitle}>Sell Amount</Text>
              <View style={styles.sellAmount}>
                <AnimatedRollingNumber
                  value={Number(state?.sellAmountInBtc)}
                  useGrouping
                  compactToFixed={6}
                  textStyle={styles.snipeInfoFieldTitle}
                />
                <Text style={styles.snipeInfoFieldTitle}> BTC</Text>
              </View>
            </View>
          </View>
        </View>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.snipeInfoCard, styles.totalAmountContainer]}>
        <View>
          <Text style={styles.snipeInfoFieldValue}>{LL.common.total()}</Text>

          <View style={styles.sellAmount}>
            <Text style={styles.snipeInfoFieldTitle}>
              {LL.common.includes().slice(0, 3)}. $
            </Text>
            <AnimatedRollingNumber
              value={Number(state.feesInUSD)}
              useGrouping
              compactToFixed={2}
              textStyle={styles.snipeInfoFieldTitle}
            />
            <Text style={styles.snipeInfoFieldTitle}> {LL.common.fee()}</Text>
          </View>
        </View>
        <View style={styles.sellAmount}>
          <Text style={styles.snipeInfoFieldValue}> $</Text>
          <AnimatedRollingNumber
            value={Number(state.totalInUSD)}
            useGrouping
            compactToFixed={2}
            textStyle={styles.snipeInfoFieldValue}
          />
        </View>
      </View>
      <GaloyPrimaryButton
        title={LL.common.withdraw()}
        containerStyle={styles.buttonContainer}
        disabled={isLoading}
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
