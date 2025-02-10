import React from "react"
import { Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { WalletCurrency } from "@app/graphql/generated"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency } from "@app/types/amounts"
import { RouteProp } from "@react-navigation/native"
import useStyles from "./styles/snipe-confirmation"
import useSnipeConfirmation from "./hooks/useSnipeConfirmation"

type Props = {
  route: RouteProp<RootStackParamList, "snipeConfirmation">
}

export const SnipeConfirmationScreen: React.FC<Props> = ({ route }) => {
  const styles = useStyles()
  const { state, actions } = useSnipeConfirmation({ route })
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
          <View style={styles.snipeInfoField}>
            <Text style={styles.snipeInfoFieldTitle}>
              {LL.SnipeConfirmationScreen.amount()}
            </Text>
            <Text style={styles.snipeInfoFieldValue}>
              {actions?.formatMoneyAmount({ moneyAmount: toAmount })}
            </Text>
            <Text style={styles.snipeInfoSubFieldValue}>
              {actions?.formatMoneyAmount({ moneyAmount: fromAmount })}
              {actions?.displayCurrency !== fromWallet.currency &&
              actions?.displayCurrency !== toWallet.currency
                ? ` - ${actions?.formatMoneyAmount({
                    moneyAmount: actions?.convertMoneyAmount(
                      state?.moneyAmount,
                      DisplayCurrency,
                    ),
                  })}`
                : ""}
            </Text>
          </View>
        </View>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </ScrollView>
      <GaloyPrimaryButton
        title={LL.common.transfer()}
        containerStyle={styles.buttonContainer}
        disabled={isLoading}
        onPress={actions?.payWallet}
        loading={isLoading}
      />
    </Screen>
  )
}
