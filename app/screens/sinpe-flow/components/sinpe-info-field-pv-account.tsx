import React from "react"
import { View, Text } from "react-native"
import { WalletCurrency } from "@app/graphql/generated"
import useStyles from "../styles/snipe-confirmation"

type Props = {
  sinpeInfoFieldTitle: string
  fromWalletCurrency: WalletCurrency
  fromAccountBalance: string
}

const SinpeInfoFieldPVAccount: React.FC<Props> = ({
  sinpeInfoFieldTitle,
  fromWalletCurrency,
  fromAccountBalance,
}) => {
  const styles = useStyles()

  return (
    <View style={styles.snipeInfoField}>
      <Text style={styles.snipeInfoFieldTitle}>{sinpeInfoFieldTitle}</Text>
      <Text style={styles.snipeInfoFieldValue}>
        {fromWalletCurrency === WalletCurrency.Btc ? "BTC Account" : "USD Account"}
      </Text>
      <Text style={styles.snipeInfoSubFieldValue}>{fromAccountBalance}</Text>
    </View>
  )
}

export default SinpeInfoFieldPVAccount
