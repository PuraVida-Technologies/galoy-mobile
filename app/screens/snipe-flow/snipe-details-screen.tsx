/* eslint-disable react-hooks/rules-of-hooks */
import React from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { WalletCurrency } from "@app/graphql/generated"
import { testProps } from "@app/utils/testProps"
import { Input, Text, useTheme } from "@rneui/themed"
import useSnipeDetails from "./hooks/useSnipeDetails"
import Icon from "react-native-vector-icons/Ionicons"
import ReactNativeModal from "react-native-modal"
import useStyles from "./styles/snipe-deatils"
import WalletsModal from "./components/wallet-card"
import BankAccounts from "./components/bank-account"

export const SnipeDetailsScreen = () => {
  const {
    theme: { colors },
  } = useTheme()

  const styles = useStyles()

  const { state, actions } = useSnipeDetails()
  const { LL } = state

  if (!state.data?.me?.defaultAccount || !state.from) {
    // TODO: proper error handling. non possible event?
    return <></>
  }

  return (
    <Screen preset="fixed">
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.walletSelectorContainer}>
          <View style={styles.walletsContainer}>
            <Text style={styles.fieldTitleText}>{LL.common.from()}</Text>
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
        <View style={styles.walletSelectorContainer}>
          <View style={styles.walletsContainer}>
            <Text style={styles.fieldTitleText}>{LL.common.bankAccount()}</Text>
            <TouchableWithoutFeedback
              {...testProps("choose-wallet-to-send-from")}
              onPress={() => actions.setOpenBankSelection(true)}
              accessible={false}
            >
              <View style={styles.fieldBackground}>
                <View style={styles.walletSelectorInfoContainer}>
                  <View style={styles.walletSelectorTypeTextContainer}>
                    <Text style={styles.walletCurrencyText}>
                      {state?.selectedBank?.data?.accountHolderName}
                    </Text>
                  </View>
                  <View style={styles.walletSelectorBalanceContainer}>
                    <Text {...testProps(`${state.from} Wallet Balance`)}>
                      {state?.selectedBank?.data?.iban}
                    </Text>
                  </View>
                </View>

                <View style={styles.pickWalletIcon}>
                  <Icon name={"chevron-down"} size={24} color={colors.black} />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <ReactNativeModal
              style={styles.bankModal}
              animationIn="fadeInDown"
              animationOut="fadeOutUp"
              isVisible={state.openBankSelection}
              onBackButtonPress={actions.toggleBankModal}
              onBackdropPress={actions.toggleBankModal}
            >
              <BankAccounts
                bankAccount={state.bankAccounts}
                styles={styles}
                updateMatchingAccounts={actions.updateMatchingAccounts}
                LL={LL}
                state={state}
                onBankAccountSelected={(account) => {
                  actions.setSelectedBank(account)
                  actions.setOpenBankSelection(false)
                }}
                toggleBankModal={actions.toggleBankModal}
                colors={colors}
                reset={actions.reset}
              />
            </ReactNativeModal>
          </View>
        </View>

        <View style={[styles.fieldContainer, styles.amountContainer]}>
          <Text style={styles.fieldTitleText}>{LL.SnipeDetailsScreen.amount()}</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.primaryCurrencySymbol}>$</Text>

            <Input
              value={state.amount}
              showSoftInputOnFocus={false}
              onChangeText={(e) => {
                // remove commas for ease of calculation later on
                const val = e.replaceAll(",", "")
                // TODO adjust for currencies that use commas instead of decimals

                // test for string input that can be either numerical or float
                if (/^\d*\.?\d*$/.test(val.trim())) {
                  const num = Number(val)
                  actions.setAmount(num.toString())
                } else {
                  actions.setAmount("")
                }
              }}
              containerStyle={styles.numberContainer}
              inputStyle={styles.numberText}
              placeholder="0"
              placeholderTextColor={colors.grey3}
              inputContainerStyle={styles.numberInputContainer}
              renderErrorMessage={false}
            />
          </View>
          {state.amountFieldError && (
            <View style={styles.errorContainer}>
              <Text color={colors.error}>{state.amountFieldError}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <GaloyPrimaryButton
        title={LL.common.next()}
        containerStyle={styles.buttonContainer}
        disabled={!state.isValidAmount}
        onPress={actions.moveToNextScreen}
      />
    </Screen>
  )
}
