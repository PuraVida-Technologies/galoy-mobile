import React, { useState } from "react"
import { Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { useConversionScreenQuery, WalletCurrency } from "@app/graphql/generated"
import { useIsAuthed } from "@app/graphql/is-authed-context"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency } from "@app/types/amounts"
import { WalletDescriptor } from "@app/types/wallets"
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native"
import { makeStyles } from "@rneui/themed"
import { gql } from "@apollo/client"

type Props = {
  route: RouteProp<RootStackParamList, "snipeConfirmation">
}

gql`
  query getWithdrawalContract(
    $bankAccountId: String!
    $sourceWalletId: String!
    $targetAmount: BigDecimal!
    $targetCurrency: AnyCurrency
  ) {
    getWithdrawalContract(
      input: {
        bankAccountId: $bankAccountId
        sourceWalletId: $sourceWalletId
        targetAmount: $targetAmount
        targetCurrency: $targetCurrency
      }
    ) {
      amounts
      bankAccount
      exchangeWallet
      feeExplanation
      id
      sourceWallet
      tokenDetails
    }
  }
`

gql`
  mutation executeWithdrawalContract($token: String!) {
    executeWithdrawalContract(input: { token: $token }) {
      amounts
      bankAccount
      bankAccountTransaction
      exchangeWallet
      feeExplanation
      id
      sourceWallet
      sourceWalletTransaction
      tokenDetails
    }
  }
`

export const SnipeConfirmationScreen: React.FC<Props> = ({ route }) => {
  const styles = useStyles()
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "snipeConfirmation">>()

  const { formatMoneyAmount, displayCurrency } = useDisplayCurrency()
  const { convertMoneyAmount } = usePriceConversion()

  const { fromWalletCurrency, moneyAmount, fromAccountBalance, bankAccount } =
    route.params
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const isAuthed = useIsAuthed()

  const isLoading = false
  const { LL } = useI18nContext()

  let fromWallet: WalletDescriptor<WalletCurrency>
  let toWallet: WalletDescriptor<WalletCurrency>

  const { data } = useConversionScreenQuery({
    fetchPolicy: "cache-first",
    skip: !isAuthed,
  })

  const btcWallet = getBtcWallet(data?.me?.defaultAccount?.wallets)
  const usdWallet = getUsdWallet(data?.me?.defaultAccount?.wallets)

  if (!data?.me || !usdWallet || !btcWallet || !convertMoneyAmount) {
    // TODO: handle errors and or provide some loading state
    return null
  }

  if (fromWalletCurrency === WalletCurrency.Btc) {
    fromWallet = { id: btcWallet.id, currency: WalletCurrency.Btc }
    toWallet = { id: usdWallet.id, currency: WalletCurrency.Usd }
  } else {
    fromWallet = { id: usdWallet.id, currency: WalletCurrency.Usd }
    toWallet = { id: btcWallet.id, currency: WalletCurrency.Btc }
  }

  const fromAmount = convertMoneyAmount(moneyAmount, fromWallet.currency)
  const toAmount = convertMoneyAmount(moneyAmount, toWallet.currency)

  const payWallet = async () => {
    console.log("clicked")
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
              {formatMoneyAmount({ moneyAmount: toAmount })}
            </Text>
            <Text style={styles.snipeInfoSubFieldValue}>
              {formatMoneyAmount({ moneyAmount: fromAmount })}
              {displayCurrency !== fromWallet.currency &&
              displayCurrency !== toWallet.currency
                ? ` - ${formatMoneyAmount({
                    moneyAmount: convertMoneyAmount(moneyAmount, DisplayCurrency),
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
        onPress={payWallet}
        loading={isLoading}
      />
    </Screen>
  )
}

const useStyles = makeStyles(({ colors }) => ({
  scrollViewContainer: {
    flexDirection: "column",
  },
  snipeInfoCard: {
    margin: 20,
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 20,
  },
  snipeInfoField: {
    marginBottom: 20,
  },
  snipeInfoFieldTitle: { color: colors.grey1 },
  snipeInfoFieldValue: {
    color: colors.grey0,
    fontWeight: "bold",
    fontSize: 18,
  },
  snipeInfoSubFieldValue: {
    color: colors.grey0,
    fontWeight: "500",
    fontSize: 14,
  },
  buttonContainer: { marginHorizontal: 20, marginBottom: 20 },
  errorContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
  },
}))
