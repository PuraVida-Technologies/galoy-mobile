import * as React from "react"
import { useMemo } from "react"
import { RefreshControl, View, Alert } from "react-native"
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler"
import Modal from "react-native-modal"
import Icon from "react-native-vector-icons/Ionicons"
import { LocalizedString } from "typesafe-i18n"

import { gql } from "@apollo/client"
import { AppUpdate } from "@app/components/app-update/app-update"
import { GaloyErrorBox } from "@app/components/atomic/galoy-error-box"
import { icons } from "@app/components/atomic/galoy-icon"
import { GaloyIconButton } from "@app/components/atomic/galoy-icon-button"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { NotificationCard } from "@app/components/notifications"
import { SetDefaultAccountModal } from "@app/components/set-default-account-modal"
import { StableSatsModal } from "@app/components/stablesats-modal"
import WalletOverview from "@app/components/wallet-overview/wallet-overview"
import {
  AccountLevel,
  Status,
  TransactionFragment,
  TxDirection,
  TxStatus,
  useHasPromptedSetDefaultAccountQuery,
  useHomeAuthedQuery,
  useHomeUnauthedQuery,
  useBankAccountsQuery,
  useRealtimePriceQuery,
  useSettingsScreenQuery,
  useKycDetailsQuery,
  useColorSchemeQuery,
} from "@app/graphql/generated"
import { useIsAuthed } from "@app/graphql/is-authed-context"
import { getErrorMessages } from "@app/graphql/utils"
import { useAppConfig } from "@app/hooks"
import { useI18nContext } from "@app/i18n/i18n-react"
import { isIos } from "@app/utils/helper"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { BottomSheet, ListItem, Text, makeStyles, useTheme } from "@rneui/themed"

import { BalanceHeader } from "../../components/balance-header"
import { Screen } from "../../components/screen"
import { MemoizedTransactionItem } from "../../components/transaction-item"
import { RootStackParamList } from "../../navigation/stack-param-lists"
import { testProps } from "../../utils/testProps"
import { PhoneLoginInitiateType } from "../phone-auth-screen"
import { requestNotificationPermission } from "@app/utils/notifications"

const TransactionCountToTriggerSetDefaultAccountModal = 1

gql`
  query homeAuthed {
    me {
      id
      language
      username
      phone
      email {
        address
        verified
      }

      defaultAccount {
        id
        level
        defaultWalletId
        pendingIncomingTransactions {
          ...Transaction
        }
        transactions(first: 20) {
          ...TransactionList
        }
        wallets {
          id
          balance
          walletCurrency
        }
      }
    }
  }

  query homeUnauthed {
    globals {
      network
    }

    currencyList {
      id
      flag
      name
      symbol
      fractionDigits
    }
  }
`

export const HomeScreen: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const colorSchemeData = useColorSchemeQuery()
  const { LL } = useI18nContext()
  const { data, loading: kycLoading } = useKycDetailsQuery({
    fetchPolicy: "network-only",
  })
  const { data: bankAccountData } = useBankAccountsQuery({
    fetchPolicy: "network-only",
  })
  const styles = useStyles({ theme: colorSchemeData.data?.colorScheme })

  const awaitingApproval = useMemo(() => {
    const kyc = data?.me?.kyc
    if (!kycLoading) {
      return (
        Boolean(
          kyc?.primaryIdentification?.type &&
            kyc?.primaryIdentification?.files &&
            kyc?.primaryIdentification?.files?.length > 0 &&
            kyc?.phoneNumber &&
            kyc?.email &&
            kyc?.gender &&
            kyc?.isPoliticallyExposed !== null &&
            kyc?.isPoliticallyExposed?.toString() &&
            kyc?.isHighRisk !== null &&
            kyc?.isHighRisk?.toString(),
        ) && kyc?.status !== Status.Approved
      )
    }
    return false
  }, [data?.me?.kyc, kycLoading])

  const onSnipeIBANPress = React.useCallback(() => {
    const message =
      data?.me?.kyc?.status === "PENDING"
        ? LL.TransferActions.sinpeIBANTransfersKYCPendingDescription()
        : data?.me?.kyc?.status === "APPROVED"
          ? LL.TransferActions.sinpeIBANTransfersBankDescription()
          : LL.TransferActions.sinpeIBANTransfersKYCDescription()
    if (data?.me?.kyc?.status !== "APPROVED") {
      Alert.alert(LL.TransferActions.sinpeIBANTransfers(), message, [
        {
          text: LL.common.confirm(),
          onPress: () => (awaitingApproval ? "" : navigation.navigate("KYCScreen")),
        },
        {
          text: LL.common.cancel(),
          style: "cancel",
        },
      ])
    } else if (bankAccountData?.getMyBankAccounts?.length === 0) {
      Alert.alert(LL.TransferActions.sinpeIBANTransfers(), message, [
        {
          text: LL.common.confirm(),
          onPress: () => navigation.navigate("addBankAccount"),
        },
        {
          text: LL.common.cancel(),
          style: "cancel",
        },
      ])
    } else {
      navigation.navigate("snipeDetails")
    }
  }, [data, bankAccountData])

  const list = [
    {
      title: LL.TransferActions.stableSats(),
      onPress: () => navigation.navigate("conversionDetails"),
    },
    {
      title: LL.TransferActions.sinpeIBAN(),
      subtitle: LL.TransferActions.sinpeIBANSubtitle(),
      onPress: () => onSnipeIBANPress(),
    },
    {
      title: LL.TransferActions.sinpeMovil(),
      subtitle: `(${LL.common.comingSoon()})`,
      disabled: true,
      onPress: () => console.log("List Item 1 pressed"),
    },
    {
      title: LL.common.cancel(),
      titleStyle: styles.cancelText,
      onPress: () => setIsVisible(false),
    },
  ]

  const {
    theme: { colors },
  } = useTheme()

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const { data: { hasPromptedSetDefaultAccount } = {} } =
    useHasPromptedSetDefaultAccountQuery()
  const [setDefaultAccountModalVisible, setSetDefaultAccountModalVisible] =
    React.useState(false)
  const toggleSetDefaultAccountModal = () =>
    setSetDefaultAccountModalVisible(!setDefaultAccountModalVisible)

  const isAuthed = useIsAuthed()

  const {
    appConfig: {
      galoyInstance: { id: galoyInstanceId },
    },
  } = useAppConfig()

  const isFocused = useIsFocused()

  const {
    data: dataAuthed,
    loading: loadingAuthed,
    error,
    refetch: refetchAuthed,
  } = useHomeAuthedQuery({
    skip: !isAuthed,
    fetchPolicy: "network-only",
    errorPolicy: "all",

    // this enables offline mode use-case
    nextFetchPolicy: "cache-and-network",
  })

  const { loading: loadingPrice, refetch: refetchRealtimePrice } = useRealtimePriceQuery({
    skip: !isAuthed,
    fetchPolicy: "network-only",

    // this enables offline mode use-case
    nextFetchPolicy: "cache-and-network",
  })

  const {
    refetch: refetchUnauthed,
    loading: loadingUnauthed,
    data: dataUnauthed,
  } = useHomeUnauthedQuery({
    skip: !isAuthed,
    fetchPolicy: "network-only",

    // this enables offline mode use-case
    nextFetchPolicy: "cache-and-network",
  })

  // keep settings info cached and ignore network call if it's already cached
  const { loading: loadingSettings } = useSettingsScreenQuery({
    skip: !isAuthed,
    fetchPolicy: "cache-first",
    // this enables offline mode use-case
    nextFetchPolicy: "cache-and-network",
  })

  const loading = loadingAuthed || loadingPrice || loadingUnauthed || loadingSettings

  const refetch = React.useCallback(() => {
    if (isAuthed) {
      refetchRealtimePrice()
      refetchAuthed()
      refetchUnauthed()
    }
  }, [isAuthed, refetchAuthed, refetchRealtimePrice, refetchUnauthed])

  const pendingIncomingTransactions =
    dataAuthed?.me?.defaultAccount?.pendingIncomingTransactions
  const transactionsEdges = dataAuthed?.me?.defaultAccount?.transactions?.edges

  const transactions = useMemo(() => {
    const transactions: TransactionFragment[] = []
    if (pendingIncomingTransactions) {
      transactions.push(...pendingIncomingTransactions)
    }
    const settledTransactions =
      transactionsEdges
        ?.map((edge) => edge.node)
        .filter(
          (tx) => tx.status !== TxStatus.Pending || tx.direction === TxDirection.Send,
        ) ?? []
    transactions.push(...settledTransactions)
    return transactions
  }, [pendingIncomingTransactions, transactionsEdges])

  const [modalVisible, setModalVisible] = React.useState(false)
  const [isStablesatModalVisible, setIsStablesatModalVisible] = React.useState(false)

  const numberOfTxs = transactions.length

  const onMenuClick = (target: Target) => {
    if (isAuthed) {
      if (
        target === "receiveBitcoin" &&
        !hasPromptedSetDefaultAccount &&
        numberOfTxs >= TransactionCountToTriggerSetDefaultAccountModal &&
        galoyInstanceId === "Main"
      ) {
        toggleSetDefaultAccountModal()
        return
      }

      // we are using any because Typescript complain on the fact we are not passing any params
      // but there is no need for a params and the types should not necessitate it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(target as any)
    } else {
      setModalVisible(true)
    }
  }

  const activateWallet = () => {
    setModalVisible(false)
    navigation.navigate("phoneFlow", {
      screen: "phoneLoginInitiate",
      params: {
        type: PhoneLoginInitiateType.CreateAccount,
      },
    })
  }

  // debug code. verify that we have 2 wallets. mobile doesn't work well with only one wallet
  // TODO: add this code in a better place
  React.useEffect(() => {
    if (
      dataAuthed?.me?.defaultAccount?.wallets?.length !== undefined &&
      dataAuthed?.me?.defaultAccount?.wallets?.length !== 2
    ) {
      Alert.alert(LL.HomeScreen.walletCountNotTwo())
    }
  }, [dataAuthed, LL])

  let recentTransactionsData:
    | {
        title: LocalizedString
        details: React.ReactNode
      }
    | undefined = undefined

  const TRANSACTIONS_TO_SHOW = 2

  if (isAuthed && transactions.length > 0) {
    recentTransactionsData = {
      title: LL.TransactionScreen.title(),
      details: (
        <>
          {transactions
            .slice(0, TRANSACTIONS_TO_SHOW)
            .map(
              (tx, index, array) =>
                tx && (
                  <MemoizedTransactionItem
                    key={`transaction-${tx.id}`}
                    txid={tx.id}
                    subtitle
                    isOnHomeScreen={true}
                    isLast={index === array.length - 1}
                    testId={`transaction-by-index-${index}`}
                  />
                ),
            )}
        </>
      ),
    }
  }

  type Target =
    | "scanningQRCode"
    | "sendBitcoinDestination"
    | "receiveBitcoin"
    | "transactionHistory"
  type IconNamesType = keyof typeof icons

  const buttons = [
    {
      title: LL.HomeScreen.receive(),
      target: "receiveBitcoin" as Target,
      icon: "receive" as IconNamesType,
    },
    {
      title: LL.HomeScreen.send(),
      target: "sendBitcoinDestination" as Target,
      icon: "send" as IconNamesType,
    },
    {
      title: LL.HomeScreen.scan(),
      target: "scanningQRCode" as Target,
      icon: "qr-code" as IconNamesType,
    },
  ]

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isAuthed && isFocused) {
      const WAIT_TIME_TO_PROMPT_USER = 5000
      timeout = setTimeout(
        requestNotificationPermission, // no op if already requested
        WAIT_TIME_TO_PROMPT_USER,
      )
    }
    return () => clearTimeout(timeout)
  }, [])

  // if (
  //   !isIos ||
  //   dataUnauthed?.globals?.network !== "mainnet" ||
  //   dataAuthed?.me?.defaultAccount.level === AccountLevel.Two
  // ) {
  buttons.unshift({
    title: LL.common.transfer(),
    target: "conversionDetails" as Target,
    icon: "transfer" as IconNamesType,
  })
  // }

  const AccountCreationNeededModal = (
    <Modal
      style={styles.modal}
      isVisible={modalVisible}
      swipeDirection={modalVisible ? ["down"] : ["up"]}
      onSwipeComplete={() => setModalVisible(false)}
      animationOutTiming={1}
      swipeThreshold={50}
    >
      <View style={styles.flex}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.cover} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.viewModal}>
        <Icon name="remove" size={64} color={colors.grey3} style={styles.icon} />
        <Text type="h1">{LL.common.needWallet()}</Text>
        <View style={styles.openWalletContainer}>
          <GaloyPrimaryButton
            title={LL.GetStartedScreen.logInCreateAccount()}
            onPress={activateWallet}
          />
        </View>
        <View style={styles.flex} />
      </View>
    </Modal>
  )

  return (
    <Screen>
      {AccountCreationNeededModal}
      <StableSatsModal
        isVisible={isStablesatModalVisible}
        setIsVisible={setIsStablesatModalVisible}
      />
      <View style={[styles.header, styles.container]}>
        <GaloyIconButton
          onPress={() => navigation.navigate("priceHistory")}
          size={"medium"}
          name="graph"
          iconOnly={true}
        />
        <BalanceHeader loading={loading} />
        <GaloyIconButton
          onPress={() => navigation.navigate("settings")}
          size={"medium"}
          name="menu"
          iconOnly={true}
        />
      </View>
      <ScrollView
        {...testProps("home-screen")}
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading && isFocused}
            onRefresh={refetch}
            colors={[colors.primary]} // Android refresh indicator colors
            tintColor={colors.primary} // iOS refresh indicator color
          />
        }
      >
        <WalletOverview
          loading={loading}
          setIsStablesatModalVisible={setIsStablesatModalVisible}
        />
        {error && <GaloyErrorBox errorMessage={getErrorMessages(error)} />}
        <View style={styles.listItemsContainer}>
          {buttons.map((item) => (
            <View key={item.icon} style={styles.button}>
              <GaloyIconButton
                name={item.icon}
                size="large"
                text={item.title}
                onPress={() =>
                  item.title === LL.common.transfer()
                    ? setIsVisible(true)
                    : onMenuClick(item.target)
                }
              />
            </View>
          ))}
        </View>
        <NotificationCard />
        <View>
          {recentTransactionsData && (
            <>
              <TouchableOpacity
                style={styles.recentTransaction}
                onPress={() => onMenuClick("transactionHistory")}
                activeOpacity={0.6}
              >
                <Text
                  type="p1"
                  style={{ color: colors.primary }}
                  bold
                  {...testProps(recentTransactionsData.title)}
                >
                  {recentTransactionsData?.title}
                </Text>
              </TouchableOpacity>
              {recentTransactionsData?.details}
            </>
          )}
        </View>

        <AppUpdate />
        <SetDefaultAccountModal
          isVisible={setDefaultAccountModalVisible}
          toggleModal={toggleSetDefaultAccountModal}
        />
      </ScrollView>
      <BottomSheet
        containerStyle={styles.bottomSheetContainer}
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
      >
        <View style={styles.listContainer}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={styles.listItemContainer}
              disabled={l.disabled}
              onPress={() => {
                setIsVisible(false)
                l.onPress()
              }}
            >
              <ListItem.Content disabled={l.disabled}>
                <ListItem.Title
                  style={[
                    l.titleStyle,
                    styles.titleStyle,
                    l.disabled && { color: colors.grey3 },
                  ]}
                >
                  {l.title}
                  {l?.subtitle && (
                    <Text style={styles.listItemSubtitle}> {l.subtitle}</Text>
                  )}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </BottomSheet>
    </Screen>
  )
}

const useStyles = makeStyles(({ colors }, { theme }: { theme?: string }) => ({
  scrollViewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    rowGap: 20,
  },
  listItemsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: colors.grey5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  noTransaction: {
    alignItems: "center",
  },
  icon: {
    height: 34,
    top: -22,
  },
  modal: {
    marginBottom: 0,
    marginHorizontal: 0,
  },
  flex: {
    flex: 1,
  },
  cover: {
    height: "100%",
    width: "100%",
  },
  viewModal: {
    alignItems: "center",
    backgroundColor: colors.white,
    height: "30%",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  openWalletContainer: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  recentTransaction: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
    backgroundColor: colors.grey5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderColor: colors.grey5,
    borderBottomWidth: 2,
    paddingVertical: 14,
  },
  button: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 74,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
  },
  error: {
    alignSelf: "center",
    color: colors.error,
  },
  container: {
    marginHorizontal: 20,
  },
  bottomSheetContainer: {
    // marginBottom: 20,
  },
  listContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
    alignItems: "center",
    backgroundColor: theme === "light" ? colors._white : colors.grey5,
  },
  listItemSubtitle: {
    color: colors.grey3,
    fontSize: 12,
  },
  titleStyle: {
    textAlign: "center",
  },
  cancelText: {
    color: colors.red,
  },
}))
