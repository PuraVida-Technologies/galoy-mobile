import React from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import { Text } from "@rneui/themed"
import Icon from "react-native-vector-icons/Ionicons"
import ReactNativeModal from "react-native-modal"
import BankAccounts from "./bank-account"
import { testProps } from "@app/utils/testProps"
import useSinpeDetails from "../hooks/useSinpeDetails"

type IBANAccountSelectorProps = {
  styles: any
  LL: any
  colors: any
  actions: any
  state: any
}

const IBANAccountSelector: React.FC<IBANAccountSelectorProps> = ({
  styles,
  LL,
  colors,
  actions,
  state,
}) => {
  console.log("IBANAccountSelector: ", state.isBTCSell)
  return (
    <View
      style={styles.walletSelectorContainer}
      onLayout={(event) => {
        const { y, height } = event.nativeEvent.layout
        actions.updateIBANAccountLayout({ y, height })
      }}
    >
      <View style={styles.walletsContainer}>
        <Text style={styles.fieldTitleText}>
          {state.isBTCSell ? LL.common.toBankAccount() : LL.common.fromBankAccount()}
        </Text>
        <TouchableWithoutFeedback
          {...testProps("choose-wallet-to-send-from")}
          onPress={() => actions.setOpenBankSelection(true)}
          accessible={false}
        >
          <View style={styles.fieldBackground}>
            <View style={styles.walletSelectorInfoContainer}>
              <View style={styles.walletSelectorTypeTextContainer}>
                <Text style={styles.walletCurrencyText}>
                  {state?.selectedBank?.data?.accountAlias}
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
  )
}

export default IBANAccountSelector
