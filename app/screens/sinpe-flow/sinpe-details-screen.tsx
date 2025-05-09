/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import { Input, Text, useTheme } from "@rneui/themed"
import useSinpeDetails from "./hooks/useSinpeDetails"
import Icon from "react-native-vector-icons/Ionicons"
import useStyles from "./styles/sinpe-details"
import PuraVidaWalletSelector from "./components/pura-vida-wallet-selector"
import IBANAccountSelector from "./components/iban-account-selector"
import { useNavigation } from "@react-navigation/native"


export type SinpeDetailsParams = {
  screenTitle: string
}

export const SinpeDetailsScreen = () => {
  const {
    theme: { colors },
  } = useTheme()

  const styles = useStyles()

  const { state, actions } = useSinpeDetails()
  const { LL } = state
  const navigation = useNavigation()

  useEffect(() => {
    // Update the screen title dynamically when isBTCSell changes
    navigation.setParams({
      screenTitle: state.isBTCSell
        ? LL.SinpeDetailsScreen.sellBTC()
        : LL.SinpeDetailsScreen.buyBTC(),
    })
  }, [state.isBTCSell, LL, navigation])

  if (!state.data?.me?.defaultAccount || !state.from) {
    // TODO: proper error handling. non possible event?
    return <></>
  }
  const topPosition = state.isBTCSell
    ? state.puraVidaWalletLayout
      ? state.puraVidaWalletLayout.y + state.puraVidaWalletLayout.height - 20
      : 0
    : state.IBANAccountLayout
      ? state.IBANAccountLayout.y + state.IBANAccountLayout.height - 20
      : 0

  return (
    <Screen
      key={state.isBTCSell ? "sellBTC" : "buyBTC"} // Force re-render when isBTCSell changes to allow fo a change in the title
      preset="fixed"
      title={
        state.isBTCSell ? LL.SinpeDetailsScreen.sellBTC() : LL.SinpeDetailsScreen.buyBTC()
      }
    >
      <ScrollView style={styles.scrollViewContainer}>
        {/* Conditionally render the components based on isBTCSell */}
        {state.isBTCSell ? (
          <>
            <PuraVidaWalletSelector
              styles={styles}
              state={state}
              actions={actions}
              LL={LL}
              colors={colors}
            />
            <View
              style={[
                styles.toggleButtonContainer,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  top: topPosition,
                },
              ]}
            >
              <TouchableWithoutFeedback onPress={() => actions.toggleIsBTCSell()}>
                <View style={styles.toggleButton}>
                  <Icon name="swap-vertical" size={24} color={colors.primary} />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <IBANAccountSelector
              styles={styles}
              state={state}
              actions={actions}
              LL={LL}
              colors={colors}
            />
          </>
        ) : (
          <>
            <IBANAccountSelector
              styles={styles}
              state={state}
              actions={actions}
              LL={LL}
              colors={colors}
            />
            <View
              style={[
                styles.toggleButtonContainer,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  top: topPosition,
                },
              ]}
            >
              <TouchableWithoutFeedback onPress={() => actions.toggleIsBTCSell()}>
                <View style={styles.toggleButton}>
                  <Icon name="swap-vertical" size={24} color={colors.primary} />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <PuraVidaWalletSelector
              styles={styles}
              state={state}
              actions={actions}
              LL={LL}
              colors={colors}
            />
          </>
        )}
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
