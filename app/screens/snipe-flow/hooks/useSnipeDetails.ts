import {
  useBankAccountsQuery,
  useConversionScreenQuery,
  useRealtimePriceQuery,
  Wallet,
  WalletCurrency,
} from "@app/graphql/generated"
import { useIsAuthed } from "@app/graphql/is-authed-context"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency, toBtcMoneyAmount, toUsdMoneyAmount } from "@app/types/amounts"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useMemo, useState } from "react"

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
    currency: string
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

  const { data } = useConversionScreenQuery({
    fetchPolicy: "cache-and-network",
    returnPartialData: true,
  })

  const { formatDisplayAndWalletAmount, formatMoneyAmount, fiatSymbol } =
    useDisplayCurrency()

  const btcWallet = getBtcWallet(data?.me?.defaultAccount?.wallets)
  const usdWallet = getUsdWallet(data?.me?.defaultAccount?.wallets)

  const { data: bankAccountData } = useBankAccountsQuery({ fetchPolicy: "network-only" })

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

  const amountFieldError = useMemo(() => {
    if (parseFloat(formattedAmount?.replace(/\,/g, "")) < parseFloat(amount)) {
      return LL.SendBitcoinScreen.amountExceed({
        balance: fromWalletBalanceFormatted,
      })
    }
    return null
  }, [formattedAmount, amount, fromWalletBalanceFormatted])

  const moveToNextScreen = () => {
    navigation.navigate("snipeConfirmation", {
      fromWalletCurrency: from,
      moneyAmount: {
        amount: Number(amount),
        currency: from,
        currencyCode: from === WalletCurrency.Btc ? "BTC" : "USD",
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

  const isValidAmount = useMemo(() => {
    return amount?.length && parseFloat(amount || "") > 0 && !amountFieldError?.length
  }, [amount, amountFieldError])

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
    },
  }
}

export type SnipeDetailsState = ReturnType<typeof useSnipeDetails>["state"]
export default useSnipeDetails
