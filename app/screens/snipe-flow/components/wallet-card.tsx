import { Wallet, WalletCurrency } from "@app/graphql/generated"
import { testProps } from "@app/utils/testProps"
import { Text } from "@rneui/themed"
import { View, TouchableWithoutFeedback } from "react-native"
import { UseSnipDetailsStyles } from "../styles/snipe-deatils"

interface Props {
  wallet: WalletCurrency
  styles: UseSnipDetailsStyles
  btcWalletBalanceFormatted: string
  usdWalletBalanceFormatted: string
  chooseWallet: (wallet: Pick<Wallet, "id" | "walletCurrency">) => void
}

const WalletsModal = ({
  wallet,
  styles,
  btcWalletBalanceFormatted,
  usdWalletBalanceFormatted,
  chooseWallet,
}: Props) => (
  <View>
    <TouchableWithoutFeedback
      key={wallet}
      {...testProps(wallet)}
      onPress={() => {
        chooseWallet(wallet)
      }}
    >
      <View style={styles.walletContainer}>
        <View style={styles.walletSelectorTypeContainer}>
          <View
            style={
              wallet === WalletCurrency.Btc
                ? styles.walletSelectorTypeLabelBitcoin
                : styles.walletSelectorTypeLabelUsd
            }
          >
            {wallet === WalletCurrency.Btc ? (
              <Text style={styles.walletSelectorTypeLabelBtcText}>BTC</Text>
            ) : (
              <Text style={styles.walletSelectorTypeLabelUsdText}>USD</Text>
            )}
          </View>
        </View>
        <View style={styles.walletSelectorInfoContainer}>
          <View style={styles.walletSelectorTypeTextContainer}>
            {wallet === WalletCurrency.Btc ? (
              <Text style={styles.walletCurrencyText}>{`${LL.common.btcAccount()}`}</Text>
            ) : (
              <Text style={styles.walletCurrencyText}>{`${LL.common.usdAccount()}`}</Text>
            )}
          </View>
          <View style={styles.walletSelectorBalanceContainer}>
            {wallet === WalletCurrency.Btc ? (
              <Text>{btcWalletBalanceFormatted}</Text>
            ) : (
              <Text>{usdWalletBalanceFormatted}</Text>
            )}
          </View>
          <View />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
)

export default WalletsModal
