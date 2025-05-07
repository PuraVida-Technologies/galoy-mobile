/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useState } from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { WalletCurrency } from "@app/graphql/generated"
import { testProps } from "@app/utils/testProps"
import { Input, Text, useTheme } from "@rneui/themed"
import useSinpeDetails from "./hooks/useSinpeDetails"
import Icon from "react-native-vector-icons/Ionicons"
import ReactNativeModal from "react-native-modal"
import useStyles from "./styles/sinpe-details"
import WalletsModal from "./components/wallet-card"
import BankAccounts from "./components/bank-account"
// import { useDisplayCurrency } from "@app/hooks/use-display-currency"

export const SinpeDetailsScreen = () => {
  const {
    theme: { colors },
  } = useTheme()

  const styles = useStyles()

  const { state, actions } = useSinpeDetails()
  const { LL } = state

  const [isToggled, setIsToggled] = useState(false) // State to track toggle
  const [topDropdownPosition, setTopDropdownPosition] = useState(0)

  const handleTopDropdownLayout = (event) => {
    const { y, height } = event.nativeEvent.layout
    setTopDropdownPosition(y + height) // Store the bottom position of the top dropdown
  }

  if (!state.data?.me?.defaultAccount || !state.from) {
    // TODO: proper error handling. non possible event?
    return <></>
  }

  return (
    <Screen preset="fixed">
      <ScrollView style={styles.scrollViewContainer}>
        {/* From Dropdown */}
        <View
          style={styles.walletSelectorContainer}
          onLayout={handleTopDropdownLayout} // Measure the layout of the top dropdown
        >
          <View style={styles.walletsContainer}>
            <Text style={styles.fieldTitleText}>{LL.common.from()}</Text>
            <TouchableWithoutFeedback
              {...testProps("choose-wallet-to-send-from")}
              onPress={() => actions.setFromSelection(true)}
              accessible={false}
            >
              <View style={styles.fieldBackground}>
                <View style={styles.walletSelectorInfoContainer}>
                  <View style={styles.walletSelectorTypeTextContainer}>
                    <Text style={styles.walletCurrencyText}>
                      {isToggled
                        ? state?.selectedBank?.data?.accountAlias // Show IBAN accounts when toggled
                        : state.from === WalletCurrency.Btc
                        ? LL.common.btcAccount()
                        : LL.common.usdAccount()}
                    </Text>
                  </View>
                  <View style={styles.walletSelectorBalanceContainer}>
                    <Text {...testProps(`${state.from} Wallet Balance`)}>
                      {isToggled
                        ? state?.selectedBank?.data?.iban // Show IBAN details when toggled
                        : state.fromWalletBalanceFormatted}
                    </Text>
                  </View>
                </View>
                <View style={styles.pickWalletIcon}>
                  <Icon name={"chevron-down"} size={24} color={colors.black} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Toggle Button */}
        {topDropdownPosition > 0 && (
          <View
            style={[
              styles.toggleButtonContainer,
              { top: topDropdownPosition - 20 }, // Dynamically position the button
            ]}
          >
            <TouchableWithoutFeedback
              onPress={() => setIsToggled((prev) => !prev)} // Toggle the state
            >
              <View style={styles.toggleButton}>
                <Icon name="swap-vertical" size={24} color={colors.primary} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}

        {/* To Dropdown */}
        <View style={styles.walletSelectorContainer}>
          <View style={styles.walletsContainer}>
            <Text style={styles.fieldTitleText}>{LL.common.toBankAccount()}</Text>
            <TouchableWithoutFeedback
              {...testProps("choose-wallet-to-send-from")}
              onPress={() => actions.setOpenBankSelection(true)}
              accessible={false}
            >
              <View style={styles.fieldBackground}>
                <View style={styles.walletSelectorInfoContainer}>
                  <View style={styles.walletSelectorTypeTextContainer}>
                    <Text style={styles.walletCurrencyText}>
                      {isToggled
                        ? state.from === WalletCurrency.Btc
                          ? LL.common.btcAccount()
                          : LL.common.usdAccount() // Show wallets when toggled
                        : state?.selectedBank?.data?.accountAlias}
                    </Text>
                  </View>
                  <View style={styles.walletSelectorBalanceContainer}>
                    <Text {...testProps(`${state.from} Wallet Balance`)}>
                      {isToggled
                        ? state.fromWalletBalanceFormatted // Show wallet balance when toggled
                        : state?.selectedBank?.data?.iban}
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
                LL={LL}
                state={state}
                onBankAccountSelected={actions.onBankAccountSelection}
                toggleBankModal={actions.toggleBankModal}
                colors={colors}
                reset={actions.reset}
              />
            </ReactNativeModal>
          </View>
        </View>
        <View style={[styles.fieldContainer, styles.amountContainer]}>
          <Text style={styles.fieldTitleText}>{LL.SinpeDetailsScreen.amount()}</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.primaryCurrencySymbol}>{state?.fiatSymbol}</Text>

            <Input
              value={state.rawInputValue} // Use raw input value from state
              showSoftInputOnFocus={true}
              keyboardType="decimal-pad"
              onChangeText={actions.handleAmountChange} // Use handler from actions
              onBlur={actions.handleAmountBlur} // Use handler from actions
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
      <View style={styles.remainingLimitContainer}>
        <Text style={styles.fieldText}>{state.remainingLimit}</Text>
        <Text style={styles.fieldText}>{LL.SendBitcoinScreen.remainingDailyLimit()}</Text>
      </View>
      <GaloyPrimaryButton
        title={LL.common.next()}
        containerStyle={styles.buttonContainer}
        disabled={!state.isValidAmount}
        onPress={actions.moveToNextScreen}
      />
    </Screen>
  )
}
