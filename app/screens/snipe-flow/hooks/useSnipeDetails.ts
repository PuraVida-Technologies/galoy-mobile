import { gql } from "@apollo/client"
import {
  BankAccountCurrencies,
  PaymentSystem,
  useBankAccountsQuery,
  useConversionScreenQuery,
  useGetWithdrawalLimitsQuery,
  useRealtimePriceQuery,
  Wallet,
  WalletCurrency,
} from "@app/graphql/generated"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency, toBtcMoneyAmount, toUsdMoneyAmount } from "@app/types/amounts"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useMemo, useState } from "react"

gql`
  query getWithdrawalLimits($input: GetWithdrawalLimitsInputDTO!) {
    getWithdrawalLimits(input: $input) {
      totalAmount
      limitValue
      currency
      limitPeriodUnit
      limitPeriodValue
      canExecute
    }
  }
`

export interface BankAccountDetails {
  id: string
  galoyUserId: string
  type: string
  countryCode: string
  data: {
    bankName: string
    accountHolderName: string
    nationalId: string
    iban: string
    sinpeCode: string
    swiftCode: string
    currency: BankAccountCurrencies
  }
}

const useSnipeDetails = () => {
  const [from, setFrom] = useState<WalletCurrency>(WalletCurrency.Btc)
  const [openFromSelection, setFromSelection] = useState<boolean>(false)
  const [paymentDetail, setPaymentDetail] = useState(null)
  const [openBankSelection, setOpenBankSelection] = useState<boolean>(false)
  const [selectedBank, setSelectedBank] = useState<BankAccountDetails | null>(null)
  const [searchText, setSearchText] = useState<string>("")
  const [matchingAccounts, setMatchingAccounts] = useState<BankAccountDetails[]>([])
  const [amount, setAmount] = useState<string>("")

  const navigation = useNavigation<NavigationProp<RootStackParamList, "snipeDetails">>()
  const { LL } = useI18nContext()

  // forcing price refresh
  useRealtimePriceQuery({
    fetchPolicy: "network-only",
  })
  const { data: bankAccountData, loading } = useBankAccountsQuery({
    fetchPolicy: "network-only",
  })

  const { data: withdrawalLimit, refetch } = useGetWithdrawalLimitsQuery({
    variables: {
      input: {
        currency: selectedBank?.data?.currency || BankAccountCurrencies.Usd,
        paymentSystemType: PaymentSystem.Iban,
      },
    },
  })

  const { data } = useConversionScreenQuery({
    fetchPolicy: "cache-and-network",
    returnPartialData: true,
  })

  const { formatDisplayAndWalletAmount, displayCurrency, formatMoneyAmount, fiatSymbol } =
    useDisplayCurrency()

  const btcWallet = getBtcWallet(data?.me?.defaultAccount?.wallets)
  const usdWallet = getUsdWallet(data?.me?.defaultAccount?.wallets)

  const { convertMoneyAmount } = usePriceConversion()

  const btcWalletBalance = toBtcMoneyAmount(btcWallet?.balance ?? NaN)
  const usdWalletBalance = toUsdMoneyAmount(usdWallet?.balance ?? NaN)

  const fromWalletBalance = useMemo(() => {
    return from === WalletCurrency.Btc ? btcWalletBalance : usdWalletBalance
  }, [from, btcWalletBalance, usdWalletBalance])

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

  const formattedAmount = formatMoneyAmount({
    moneyAmount: convertMoneyAmount?.(fromWalletBalance, DisplayCurrency) || {
      amount: 0,
      currency: DisplayCurrency,
      currencyCode: "BTC",
    },
    noSymbol: true,
  })

  const moveToNextScreen = () => {
    navigation.navigate("snipeConfirmation", {
      fromWalletCurrency: from,
      moneyAmount: {
        amount: Number(amount),
        currency: displayCurrency,
        currencyCode: displayCurrency,
      },
      bankAccount: {
        ...selectedBank?.data,
        id: selectedBank?.id || "",
      },
      fromAccountBalance: fromWalletBalanceFormatted,
      wallet: from === WalletCurrency.Btc ? btcWallet : usdWallet,
    })
  }

  const toggleModal = () => {
    setFromSelection(false)
  }
  const bankAccounts = useMemo(() => {
    return bankAccountData?.getMyBankAccounts?.slice() ?? []
  }, [bankAccountData])

  useEffect(() => {
    setMatchingAccounts(bankAccounts)
    setSelectedBank(bankAccounts?.[0] || null)
  }, [bankAccountData])

  const toggleBankModal = () => {
    setOpenBankSelection(false)
  }

  const updateMatchingAccounts = useCallback(
    (newSearchText: string) => {
      setSearchText(newSearchText)
      if (newSearchText.length > 0) {
        const matchingAccounts = bankAccounts.filter(
          (account) =>
            account?.data?.bankName.toLowerCase().includes(newSearchText.toLowerCase()) ||
            account?.data?.iban.toLowerCase().includes(newSearchText.toLowerCase()) ||
            account?.data?.accountHolderName
              .toLowerCase()
              .includes(newSearchText.toLowerCase()),
        )
        setMatchingAccounts(matchingAccounts)
      } else {
        setMatchingAccounts(bankAccounts)
      }
    },
    [bankAccounts, searchText],
  )

  const chooseWallet = (wallet: Pick<Wallet, "id" | "walletCurrency">) => {
    setFrom(wallet)
    toggleModal()
  }

  const reset = useCallback(() => {
    setSearchText("")
    setMatchingAccounts(bankAccounts)
  }, [bankAccounts])

  const onBankAccountSelection = useCallback((account) => {
    setOpenBankSelection(false)
    setSelectedBank(account)
    refetch()
  }, [])

  const remainingLimit = useMemo(() => {
    return parseFloat(withdrawalLimit?.getWithdrawalLimits?.[0]?.limitValue || "0")
  }, [withdrawalLimit?.getWithdrawalLimits?.[0]?.limitValue])

  const usdRemainingLimitMoneyAmount = convertMoneyAmount?.(
    {
      amount: remainingLimit || 0,
      currency: selectedBank?.data?.currency || BankAccountCurrencies.Usd,
      currencyCode: selectedBank?.data?.currency || BankAccountCurrencies.Usd,
    },
    selectedBank?.data?.currency || BankAccountCurrencies.Usd,
  )

  const remainingLimitText =
    usdRemainingLimitMoneyAmount && !loading
      ? `${formatMoneyAmount({
          moneyAmount: usdRemainingLimitMoneyAmount,
        })}`
      : "0"

  const minimumWithdrawal = useMemo(() => {
    return displayCurrency === BankAccountCurrencies.Crc ? 500000 : 1000
  }, [displayCurrency])

  const minimumAmountText = formatMoneyAmount({
    moneyAmount: {
      amount: minimumWithdrawal,
      currency: displayCurrency,
      currencyCode: displayCurrency,
    },
  })

  const amountFieldError = useMemo(() => {
    if (parseFloat(amount) < minimumWithdrawal / 100) {
      return LL.SendBitcoinScreen.amountMinimumLimit({
        limit: minimumAmountText,
      })
    } else if (parseFloat(formattedAmount?.replace(/\,/g, "")) < parseFloat(amount)) {
      return LL.SendBitcoinScreen.amountExceed({
        balance: fromWalletBalanceFormatted,
      })
    } else if (parseFloat(amount) > remainingLimit) {
      return LL.SendBitcoinScreen.amountExceedsLimit({
        limit: remainingLimitText,
      })
    }
    return null
  }, [formattedAmount, amount, minimumWithdrawal, fromWalletBalanceFormatted])

  const isValidAmount = useMemo(() => {
    return amount?.length && parseFloat(amount || "") > 0 && !amountFieldError?.length
  }, [amount, amountFieldError])

  return {
    state: {
      LL,
      from,
      openFromSelection,
      paymentDetail,
      openBankSelection,
      selectedBank,
      searchText,
      matchingAccounts,
      amount,
      isValidAmount,
      formattedAmount,
      fromWalletBalanceFormatted,
      btcWalletBalanceFormatted,
      usdWalletBalanceFormatted,
      data,
      amountFieldError,
      bankAccounts,
      fiatSymbol,
      remainingLimit: remainingLimitText,
    },
    actions: {
      moveToNextScreen,
      setFrom,
      setFromSelection,
      setPaymentDetail,
      setOpenBankSelection,
      setSelectedBank,
      setSearchText,
      setMatchingAccounts,
      setAmount,
      reset,
      updateMatchingAccounts,
      chooseWallet,
      toggleBankModal,
      toggleModal,
      onBankAccountSelection,
    },
  }
}

export type SnipeDetailsState = ReturnType<typeof useSnipeDetails>["state"]
export default useSnipeDetails
