import { gql } from "@apollo/client"
import {
  BankAccountCr,
  BankAccountCurrencies,
  PaymentSystem,
  useBankAccountsQuery,
  useConversionScreenQuery,
  useGetWithdrawalLimitsQuery,
  useRealtimePriceQuery,
  WalletCurrency,
} from "@app/graphql/generated"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import {
  DisplayCurrency,
  toBtcMoneyAmount,
  toUsdMoneyAmount,
  WalletOrDisplayCurrency,
} from "@app/types/amounts"
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
    id: string
    bankName: string
    accountAlias: string
    iban: string
    currency: BankAccountCurrencies
  }
}

const useSinpeDetails = () => {
  const [from, setFrom] = useState<WalletCurrency>(WalletCurrency.Btc)
  const [openFromSelection, setFromSelection] = useState<boolean>(false)
  const [paymentDetail, setPaymentDetail] = useState(null)
  const [openBankSelection, setOpenBankSelection] = useState<boolean>(false)
  const [selectedBank, setSelectedBank] = useState<BankAccountCr | null>(null)
  const [searchText, setSearchText] = useState<string>("")
  const [matchingAccounts, setMatchingAccounts] = useState<BankAccountCr[]>([])
  const [amount, setAmount] = useState<string>("")
  const [fiatSymbol, setFiatSymbol] = useState<string>("$") // Default to USD symbol
  const [fractionDigits, setFractionDigits] = useState<number>(2) // Default to 2 for USD
  const [rawInputValue, setRawInputValue] = useState<string>("") // Track raw input value
  const [puraVidaWalletLayout, setPuraVidaWalletLayout] = useState<{
    y: number
    height: number
  } | null>(null)
  const [IBANAccountLayout, updateIBANAccountLayout] = useState<{
    y: number
    height: number
  } | null>(null)
  const [isBTCSell, setIsBTCSell] = useState(true)

  const navigation = useNavigation<NavigationProp<RootStackParamList, "sinpeDetails">>()
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

  const { formatDisplayAndWalletAmount, displayCurrency, formatMoneyAmount } =
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

  const formattedAmount = useMemo(() => {
    const fractionDigitsToUse = fractionDigits ?? 2 // Default to 2 if not found

    if (!rawInputValue) {
      return "" // Return empty if no input is set
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: fractionDigitsToUse,
      maximumFractionDigits: fractionDigitsToUse,
    }).format(Number(rawInputValue))
  }, [rawInputValue, fractionDigits])

  const handleAmountChange = (value: string) => {
    // Remove commas for ease of calculation later on
    const val = value.replaceAll(",", "")

    const fractionDigitsToUse = fractionDigits ?? 2 // Default to 2 if not found

    if (fractionDigitsToUse === 0) {
      // Do not allow decimals for currencies with 0 fraction digits
      if (/^\d*$/.test(val.trim())) {
        setRawInputValue(val) // Update raw input value
        setAmount(val) // Update state amount
      }
      return // Ignore invalid input
    }

    // Allow up to `fractionDigitsToUse` decimal places for other currencies
    const regex = new RegExp(`^\\d*\\.?\\d{0,${fractionDigitsToUse}}$`)
    if (regex.test(val.trim())) {
      setRawInputValue(val) // Update raw input value
      setAmount(val) // Update state amount
    }
    // Ignore invalid input (do not reset the value)
  }

  const handleAmountBlur = () => {
    // Format the value when the user finishes editing
    const fractionDigitsToUse = fractionDigits ?? 2 // Default to 2 if not found

    if (rawInputValue) {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: fractionDigitsToUse,
        maximumFractionDigits: fractionDigitsToUse,
      }).format(Number(rawInputValue))
      setRawInputValue(formatted) // Update raw input value with formatted value
    }
  }

  const moveToNextScreen = () => {
    const sourceCurrency = selectedBank?.data?.currency || BankAccountCurrencies.Usd // Use the selected bank's currency

    navigation.navigate("sinpeConfirmation", {
      fromWalletCurrency: from,
      moneyAmount: {
        amount: Number(amount),
        currency: sourceCurrency as WalletOrDisplayCurrency, // Use sourceCurrency here
        currencyCode: sourceCurrency, // Use sourceCurrency here
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

  const chooseWallet = (wallet: WalletCurrency) => {
    setFrom(wallet)
    toggleModal()
  }

  const reset = useCallback(() => {
    setSearchText("")
    setMatchingAccounts(bankAccounts)
  }, [bankAccounts])

  const onBankAccountSelection = useCallback((account: BankAccountCr) => {
    console.log("Selected bank account:", account)
    setOpenBankSelection(false)
    setSelectedBank(account)

    // Update fiatSymbol and fractionDigits based on the selected bank account's currency
    const currency = account.data.currency
    setFiatSymbol(currency === BankAccountCurrencies.Usd ? "$" : "₡")
    setFractionDigits(currency === BankAccountCurrencies.Usd ? 2 : 0)

    // Reset the amount and raw input value
    setAmount("")
    setRawInputValue("") // Ensure this is passed to the component where rawInputValue is managed

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
    const currency = selectedBank?.data?.currency || BankAccountCurrencies.Usd
    return currency === BankAccountCurrencies.Crc ? 500000 : 1000 // CRC has a higher minimum
  }, [selectedBank])

  const minimumAmountText = useMemo(() => {
    const currency = selectedBank?.data?.currency || BankAccountCurrencies.Usd
    return formatMoneyAmount({
      moneyAmount: {
        amount: minimumWithdrawal,
        currency,
        currencyCode: currency,
      },
    })
  }, [minimumWithdrawal, selectedBank])

  const amountFieldError = useMemo(() => {
    const parsedAmount = parseFloat(amount || "0")
    const minimumAmount = minimumWithdrawal / 100 // Adjust for fractional digits if needed

    if (parsedAmount < minimumAmount) {
      return LL.SendBitcoinScreen.amountMinimumLimit({
        limit: minimumAmountText,
      })
    } else if (parseFloat(formattedAmount?.replace(/,/g, "")) < parsedAmount) {
      return LL.SendBitcoinScreen.amountExceed({
        balance: fromWalletBalanceFormatted,
      })
    } else if (parsedAmount > remainingLimit) {
      return LL.SendBitcoinScreen.amountExceedsLimit({
        limit: remainingLimitText,
      })
    }
    return null
  }, [
    formattedAmount,
    amount,
    minimumWithdrawal,
    fromWalletBalanceFormatted,
    remainingLimit,
  ])

  const isValidAmount = useMemo(() => {
    return amount?.length && parseFloat(amount || "") > 0 && !amountFieldError?.length
  }, [amount, amountFieldError])

  const updatePuraVidaWalletLayout = (layout: { y: number; height: number }) => {
    setPuraVidaWalletLayout(layout)
  }

  const toggleIsBTCSell = () => {
    setIsBTCSell((prev) => !prev)
  }

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
      fractionDigits,
      remainingLimit: remainingLimitText,
      rawInputValue,
      puraVidaWalletLayout, // Add layout to state
      IBANAccountLayout,
      isBTCSell, // Add isBTCSell to state
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
      chooseWallet,
      toggleBankModal,
      toggleModal,
      onBankAccountSelection,
      handleAmountChange, // Add handleAmountChange to actions
      handleAmountBlur, // Add handleAmountBlur to actions
      updatePuraVidaWalletLayout, // Add action to update layout
      updateIBANAccountLayout,
      toggleIsBTCSell, // Add action to toggle isBTCSell
    },
  }
}

export type SnipeDetailsState = ReturnType<typeof useSinpeDetails>["state"]
export default useSinpeDetails
