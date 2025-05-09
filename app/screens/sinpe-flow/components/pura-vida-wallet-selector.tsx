import React from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { Text } from "@rneui/themed"
import Icon from "react-native-vector-icons/Ionicons"
import ReactNativeModal from "react-native-modal"
import WalletsModal from "./wallet-card"
import { WalletCurrency } from "@app/graphql/generated"
import { testProps } from "@app/utils/testProps"

type PuraVidaWalletSelectorProps = {
  styles: any
  LL: any
  colors: any
  state: any
  actions: any
}

const PuraVidaWalletSelector: React.FC<PuraVidaWalletSelectorProps> = ({
  styles,
  LL,
  colors,
  state,
  actions,
}) => {
  return (
    <View
      style={styles.walletSelectorContainer}
      onLayout={(event) => {
        const { y, height } = event.nativeEvent.layout
        actions.updatePuraVidaWalletLayout({ y, height }) // Update layout in state
      }}
    >
      <View style={styles.walletsContainer}>
        <Text style={styles.fieldTitleText}>
          {state.isBTCSell ? LL.common.from() : LL.common.to()}
        </Text>
        <TouchableWithoutFeedback
          {...testProps("choose-wallet-to-send-from")}
          onPress={() => actions.setFromSelection(true)}
          accessible={false}
        >
          <View style={styles.fieldBackground}>
            <View style={styles.walletSelectorTypeContainer}>
              <View
                style={
                  state.from === WalletCurrency.Btc
                    ? styles.walletSelectorTypeLabelBitcoin
                    : styles.walletSelectorTypeLabelUsd
                }
              >
                {state.from === WalletCurrency.Btc ? (
                  <Text style={styles.walletSelectorTypeLabelBtcText}>BTC</Text>
                ) : (
                  <Text style={styles.walletSelectorTypeLabelUsdText}>USD</Text>
                )}
              </View>
            </View>

            <View style={styles.walletSelectorInfoContainer}>
              <View style={styles.walletSelectorTypeTextContainer}>
                {state.from === WalletCurrency.Btc ? (
                  <>
                    <Text style={styles.walletCurrencyText}>
                      {LL.common.btcAccount()}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.walletCurrencyText}>
                      {LL.common.usdAccount()}
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.walletSelectorBalanceContainer}>
                <Text {...testProps(`${state.from} Wallet Balance`)}>
                  {state.fromWalletBalanceFormatted}
                </Text>
              </View>
            </View>

            <View style={styles.pickWalletIcon}>
              <Icon name={"chevron-down"} size={24} color={colors.black} />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <ReactNativeModal
          style={styles.modal}
          animationIn="fadeInDown"
          animationOut="fadeOutUp"
          isVisible={state.openFromSelection}
          onBackButtonPress={actions.toggleModal}
          onBackdropPress={actions.toggleModal}
        >
          <View>
            {[WalletCurrency.Btc, WalletCurrency.Usd].map((wallet) => {
              return (
                <WalletsModal
                  key={wallet}
                  wallet={wallet}
                  LL={LL}
                  styles={styles}
                  btcWalletBalanceFormatted={state.btcWalletBalanceFormatted}
                  usdWalletBalanceFormatted={state.usdWalletBalanceFormatted}
                  chooseWallet={actions.chooseWallet}
                />
              )
            })}
          </View>
        </ReactNativeModal>
      </View>
    </View>
  )
}

export default PuraVidaWalletSelector
