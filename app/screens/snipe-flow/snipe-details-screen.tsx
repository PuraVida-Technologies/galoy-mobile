/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useMemo } from "react"
import { Platform, View, TouchableWithoutFeedback, Pressable } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { gql } from "@apollo/client"
import { AmountInput } from "@app/components/amount-input"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { Screen } from "@app/components/screen"
import {
  useBankAccountsQuery,
  useConversionScreenQuery,
  useRealtimePriceQuery,
  WalletCurrency,
} from "@app/graphql/generated"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useConvertMoneyDetails } from "@app/screens/conversion-flow/use-convert-money-details"
import {
  DisplayCurrency,
  lessThan,
  toBtcMoneyAmount,
  toUsdMoneyAmount,
} from "@app/types/amounts"
import { testProps } from "@app/utils/testProps"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Input, makeStyles, Text, useTheme } from "@rneui/themed"
import useSnipeDetails from "./hooks/useSnipeDetails"
import Icon from "react-native-vector-icons/Ionicons"
import ReactNativeModal from "react-native-modal"
import { usePriceConversion } from "@app/hooks"
import { SearchBar } from "@rneui/base"

gql`
  query conversionScreen {
    me {
      id
      defaultAccount {
        id
        wallets {
          id
          balance
          walletCurrency
        }
      }
    }
  }
`

export const SnipeDetailsScreen = () => {
  const {
    theme: { colors },
  } = useTheme()

  const styles = useStyles()
  const navigation = useNavigation<NavigationProp<RootStackParamList, "snipeDetails">>()

  // forcing price refresh
  useRealtimePriceQuery({
    fetchPolicy: "network-only",
  })

  const { data } = useConversionScreenQuery({
    fetchPolicy: "cache-and-network",
    returnPartialData: true,
  })

  const { LL } = useI18nContext()
  const { formatDisplayAndWalletAmount, formatMoneyAmount } = useDisplayCurrency()

  const btcWallet = getBtcWallet(data?.me?.defaultAccount?.wallets)
  const usdWallet = getUsdWallet(data?.me?.defaultAccount?.wallets)

  const { fromWallet, setWallets, settlementSendAmount, moneyAmount } =
    useConvertMoneyDetails(
      btcWallet && usdWallet
        ? { initialFromWallet: btcWallet, initialToWallet: usdWallet }
        : undefined,
    )

  const { data: bankAccountData } = useBankAccountsQuery({ fetchPolicy: "network-only" })

  const { state, actions } = useSnipeDetails()
  const { convertMoneyAmount } = usePriceConversion()

  useEffect(() => {
    if (!fromWallet && btcWallet && usdWallet) {
      setWallets({
        fromWallet: btcWallet,
        toWallet: usdWallet,
      })
    }
  }, [btcWallet, usdWallet, fromWallet, setWallets])

  if (!data?.me?.defaultAccount || !fromWallet) {
    // TODO: proper error handling. non possible event?
    return <></>
  }

  const btcWalletBalance = toBtcMoneyAmount(btcWallet?.balance ?? NaN)
  const usdWalletBalance = toUsdMoneyAmount(usdWallet?.balance ?? NaN)

  const fromWalletBalance =
    state.from === WalletCurrency.Btc ? btcWalletBalance : usdWalletBalance
  const fromWalletBalanceFormatted = formatDisplayAndWalletAmount({
    displayAmount: convertMoneyAmount?.(fromWalletBalance, DisplayCurrency) || {
      amount: 0,
      currency: DisplayCurrency,
      currencyCode: "BTC",
    },
    walletAmount: fromWalletBalance,
  })
  const btcWalletBalanceFormatted = formatDisplayAndWalletAmount({
    displayAmount: convertMoneyAmount?.(btcWalletBalance, DisplayCurrency) || {
      amount: 0,
      currency: DisplayCurrency,
      currencyCode: "BTC",
    },
    walletAmount: btcWalletBalance,
  })
  const usdWalletBalanceFormatted = formatDisplayAndWalletAmount({
    displayAmount: convertMoneyAmount?.(usdWalletBalance, DisplayCurrency) || {
      amount: 0,
      currency: DisplayCurrency,
      currencyCode: "USD",
    },
    walletAmount: usdWalletBalance,
  })

  let amountFieldError: string | undefined = undefined

  const formattedAmount = formatMoneyAmount({
    moneyAmount: convertMoneyAmount?.(fromWalletBalance, DisplayCurrency) || {
      amount: 0,
      currency: DisplayCurrency,
      currencyCode: "BTC",
    },
    noSymbol: true,
  })

  if (parseFloat(formattedAmount) < parseFloat(state.amount)) {
    amountFieldError = LL.SendBitcoinScreen.amountExceed({
      balance: fromWalletBalanceFormatted,
    })
  }

  const moveToNextScreen = () => {
    navigation.navigate("snipeConfirmation", {
      fromWalletCurrency: fromWallet.walletCurrency,
      moneyAmount,
      bankAccount: {
        accountHolderName: state.selectedBank?.data?.accountHolderName || "",
        iban: state.selectedBank?.data?.iban || "",
      },
      fromAccountBalance: fromWalletBalanceFormatted,
    })
  }

  const toggleModal = () => {
    actions.setFromSelection(false)
  }
  const bankAccounts = useMemo(() => {
    return bankAccountData?.getMyBankAccounts?.slice() ?? []
  }, [bankAccountData])

  const isValidAmount = useMemo(() => {
    return (
      state?.amount?.length &&
      parseFloat(state?.amount || "") > 0 &&
      !amountFieldError?.length
    )
  }, [state?.amount, amountFieldError])

  useEffect(() => {
    actions.setMatchingAccounts(bankAccounts)
    actions.setSelectedBank(bankAccounts?.[0] || null)
  }, [bankAccountData])

  const toggleBankModal = () => {
    actions.setOpenBankSelection(false)
  }

  const updateMatchingAccounts = useCallback(
    (newSearchText: string) => {
      actions.setSearchText(newSearchText)
      if (newSearchText.length > 0) {
        const matchingAccounts = bankAccounts.filter(
          (account) =>
            account?.data?.bankName.toLowerCase().includes(newSearchText.toLowerCase()) ||
            account?.data?.iban.toLowerCase().includes(newSearchText.toLowerCase()) ||
            account?.data?.accountHolderName
              .toLowerCase()
              .includes(newSearchText.toLowerCase()),
        )
        actions.setMatchingAccounts(matchingAccounts)
      } else {
        actions.setMatchingAccounts(bankAccounts)
      }
    },
    [bankAccounts, state.searchText],
  )

  const chooseWallet = (wallet: Pick<Wallet, "id" | "walletCurrency">) => {
    actions.setFrom(wallet)
    toggleModal()
  }

  const ModalWalletCard = ({ wallet }) => (
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
                <Text
                  style={styles.walletCurrencyText}
                >{`${LL.common.btcAccount()}`}</Text>
              ) : (
                <Text
                  style={styles.walletCurrencyText}
                >{`${LL.common.usdAccount()}`}</Text>
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

  const reset = useCallback(() => {
    actions.setSearchText("")
    actions.setMatchingAccounts(bankAccounts)
  }, [bankAccounts])

  const ModalBankAccount = ({ bankAccount }) => (
    <View style={styles.container}>
      <Icon
        name="close"
        style={styles.closeIcon}
        onPress={toggleBankModal}
        color={colors.black}
      />

      {bankAccount?.length && (
        <SearchBar
          {...testProps(LL.common.search())}
          placeholder={LL.common.search()}
          value={state.searchText}
          onChangeText={updateMatchingAccounts}
          platform="default"
          round
          autoFocus
          showLoading={false}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainerStyle}
          inputStyle={styles.searchBarText}
          rightIconContainerStyle={styles.searchBarRightIconStyle}
          searchIcon={<Icon name="search" size={24} color={styles.icon.color} />}
          clearIcon={
            <Icon name="close" size={24} onPress={reset} color={styles.icon.color} />
          }
        />
      )}
      <ScrollView>
        {state.matchingAccounts?.map((account, index) => (
          <Pressable
            key={index}
            onPress={() => {
              actions.setSelectedBank(account)
              actions.setOpenBankSelection(false)
            }}
            style={styles.cardContainer}
            // {...testProps(title)}
          >
            <View style={styles.spacing}>
              <Text type="p2">{account?.data?.accountHolderName}</Text>
              <Text>{account?.data?.iban}</Text>

              <Text type={"p4"} ellipsizeMode="tail" numberOfLines={1}>
                {account?.data?.currency}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )

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
                    <Text {...testProps(`${fromWallet.walletCurrency} Wallet Balance`)}>
                      {fromWalletBalanceFormatted}
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
              onBackButtonPress={toggleModal}
              onBackdropPress={toggleModal}
            >
              <View>
                {[WalletCurrency.Btc, WalletCurrency.Usd].map((wallet) => {
                  return <ModalWalletCard wallet={wallet} selectedWallet={state.from} />
                })}
                {/* {ModalWalletCard(toWallet)} */}
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
                    <Text {...testProps(`${fromWallet.walletCurrency} Wallet Balance`)}>
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
              onBackButtonPress={toggleBankModal}
              onBackdropPress={toggleBankModal}
            >
              <ModalBankAccount bankAccount={bankAccounts} />
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
          {amountFieldError && (
            <View style={styles.errorContainer}>
              <Text color={colors.error}>{amountFieldError}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <GaloyPrimaryButton
        title={LL.common.next()}
        containerStyle={styles.buttonContainer}
        disabled={!isValidAmount}
        onPress={moveToNextScreen}
      />
    </Screen>
  )
}

const useStyles = makeStyles(({ colors }) => ({
  scrollViewContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  toFieldContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 75,
  },
  walletSelectorContainer: {
    flexDirection: "row",
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  walletsContainer: {
    flex: 1,
  },
  walletSeparator: {
    flexDirection: "row",
    height: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    backgroundColor: colors.grey4,
    height: 1,
    flex: 1,
  },
  switchButton: {
    height: 50,
    width: 50,
    borderRadius: 50,
    elevation: Platform.OS === "android" ? 50 : 0,
    backgroundColor: colors.grey4,
    justifyContent: "center",
    alignItems: "center",
  },
  fromFieldContainer: {
    flexDirection: "row",
    marginBottom: 15,
    marginRight: 75,
  },
  percentageFieldLabel: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 10,
  },
  walletSelectorInfoContainer: {
    flex: 1,
    flexDirection: "column",
  },
  walletCurrencyText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  walletSelectorBalanceContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  percentageFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    flexWrap: "wrap",
  },
  percentageField: {
    backgroundColor: colors.grey5,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    minWidth: 80,
  },
  percentageLabelContainer: {
    flex: 1,
  },
  percentageContainer: {
    flexDirection: "row",
  },
  buttonContainer: { marginHorizontal: 20, marginBottom: 20 },
  errorContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  pickWalletIcon: {},
  walletSelectorTypeTextContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  walletSelectorTypeLabelUsdText: {
    fontWeight: "bold",
    color: colors.black,
  },
  walletSelectorTypeLabelBtcText: {
    fontWeight: "bold",
    color: colors.white,
  },
  walletSelectorTypeLabelUsd: {
    height: 30,
    width: 50,
    backgroundColor: colors._green,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  walletSelectorTypeLabelBitcoin: {
    height: 30,
    width: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  walletSelectorTypeContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 50,
    marginRight: 20,
  },
  fieldBackground: {
    flexDirection: "row",
    borderStyle: "solid",
    overflow: "hidden",
    backgroundColor: colors.grey5,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  fieldTitleText: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  walletContainer: {
    flexDirection: "row",
    borderStyle: "solid",
    overflow: "hidden",
    backgroundColor: colors.grey5,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    minHeight: 60,
  },
  modal: {
    marginBottom: "90%",
  },
  spacing: {
    paddingHorizontal: 16,
    paddingRight: 12,
    paddingVertical: 12,
    flex: 1,
  },
  container: {
    height: "100%",
    marginHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 60,
  },
  bankModal: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  cardContainer: {
    backgroundColor: colors.grey5,
    borderRadius: 12,
    marginBottom: 20,
    height: 80,
  },
  searchBarContainer: {
    backgroundColor: colors.white,
    borderBottomColor: colors.white,
    borderTopColor: colors.white,
    marginVertical: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: colors.grey5,
  },
  searchBarRightIconStyle: {
    padding: 8,
  },
  searchBarText: {
    color: colors.black,
    textDecorationLine: "none",
  },
  icon: {
    color: colors.black,
  },
  closeIcon: {
    fontSize: 40,
    alignItems: "flex-end",
    position: "absolute",
    right: -10,
    top: 16,
  },
  numberText: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
  },
  numberContainer: {
    flex: 1,
  },
  numberInputContainer: {
    borderBottomWidth: 0,
  },
  amountContainer: {
    flexDirection: "column",
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  primaryCurrencySymbol: {
    fontSize: 20,
    fontWeight: "bold",
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
}))
