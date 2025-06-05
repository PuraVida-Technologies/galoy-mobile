import { gql } from "@apollo/client"
import {
  BankAccountCurrencies,
  Currencies,
  HomeAuthedDocument,
  useExecuteDepositContractMutation,
  useGetDepositContractLazyQuery,
  WalletCurrency,
} from "@app/graphql/generated"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import useWallet from "@app/hooks/use-wallet"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency, toUsdMoneyAmount } from "@app/types/amounts"
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

gql`
  mutation ExecuteDepositContract($input: ExecuteContractInput!) {
    executeDepositContract(input: $input) {
      id
    }
  }
`

gql`
  query getDepositContract($input: DepositContractInput!) {
    getDepositContract(input: $input) {
      amounts {
        bankAccountDebit {
          amount
          amountInSats
          amountInSourceCurrency
          btcSatPrice
          currency
          resolvedAt
        }
        fee {
          amount
          amountInSats
          btcSatPrice
          amountInSourceCurrency
          currency
          resolvedAt
        }
        target {
          amount
          amountInSats
          amountInSourceCurrency
          btcSatPrice
          currency
          resolvedAt
        }
        walletCredit {
          amount
          amountInSats
          btcSatPrice
          amountInSourceCurrency
          currency
          resolvedAt
        }
      }
      limits {
        totalAmount
        canExecute
        currency
        limitPeriodUnit
        limitPeriodValue
        limitValue
      }
      bankAccount {
        ... on BankAccountCR {
          id
          galoyUserId
          type
          countryCode
          data {
            bankName
            iban
            currency
            accountAlias
          }
        }
      }
      exchangeWallet {
        id
        currency
      }
      feeExplanation
      id
      sourceWallet {
        currency
        id
      }
      tokenDetails {
        body
        createdAt
        executedAt
        expiresAt
      }
    }
  }
`
type Props = {
  route: RouteProp<RootStackParamList, "sinpeDepositConfirmation">
}

export interface BankAccountDetails {
  id: string
  galoyUserId: string
  type: string
  countryCode: string
  data: {
    bankName: string
    iban: string
    currency: string
  }
}

const useSinpeDepositConfirmation = ({ route }: Props) => {
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // User-friendly error message
  const [errorDetails, setErrorDetails] = useState<string | null>(null) // Technical error details
  const interval = useRef<NodeJS.Timeout>()
  const { LL } = useI18nContext()

  // Navigation and params
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Primary">>()
  const { fromWalletCurrency, moneyAmount, fromAccountBalance, wallet, bankAccount } =
    route.params

  const { data, btcWallet, usdWallet } = useWallet()

  const {
    formatMoneyAmount,
    moneyAmountToMajorUnitOrSats,
    displayCurrency,
    displayCurrencyDictionary,
  } = useDisplayCurrency()

  const { convertMoneyAmount } = usePriceConversion()

  const [accountDefaultWalletQuery, { data: contract, loading, error }] =
    useGetDepositContractLazyQuery({
      variables: {
        input: {
          amount: (moneyAmount?.amount * 100).toString(),
          bankAccountId: bankAccount?.id || "",
          sourceCurrency: (bankAccount?.currency as Currencies) || WalletCurrency.Usd, // Use bankAccount's currency
          walletId: wallet?.id || "",
        },
      },
    })
  const [executeDepositContract, { loading: depositing }] =
    useExecuteDepositContractMutation({
      refetchQueries: [HomeAuthedDocument],
    })

  useEffect(() => {
    accountDefaultWalletQuery({ fetchPolicy: "network-only" })
  }, [])

  useEffect(() => {
    if (error) {
      navigation.goBack()
    }
  }, [error])

  useEffect(() => {
    interval.current = setInterval(() => {
      accountDefaultWalletQuery({ fetchPolicy: "network-only" })
    }, 15000)

    return () => clearInterval(interval.current)
  }, [])

  useEffect(() => {
    if (success) {
      clearInterval(interval.current)
    }
  }, [success, interval.current])

  const btcPriceInAmount = convertMoneyAmount?.(
    {
      amount:
        parseFloat(
          contract?.getDepositContract?.amounts?.walletCredit?.btcSatPrice || "0",
        ) * 1000000,
      currency:
        contract?.getDepositContract?.amounts?.target?.currency ||
        bankAccount?.currency ||
        WalletCurrency.Usd, // Provide a default value
      currencyCode:
        contract?.getDepositContract?.amounts?.target?.currency ||
        bankAccount?.currency ||
        WalletCurrency.Usd,
    },
    bankAccount?.currency || WalletCurrency.Usd,
  )

  const sellAmount = moneyAmountToMajorUnitOrSats({
    amount: parseFloat(contract?.getDepositContract.amounts.target.amount || "0"),
    currency: bankAccount?.currency || WalletCurrency.Usd,
    currencyCode: bankAccount?.currency || WalletCurrency.Usd,
  })

  const feesAmount = moneyAmountToMajorUnitOrSats({
    amount: parseFloat(contract?.getDepositContract.amounts.fee.amount || "0"),
    currency: bankAccount?.currency || WalletCurrency.Usd,
    currencyCode: bankAccount?.currency || WalletCurrency.Usd,
  })

  const totalAmount = Number(sellAmount) - Number(feesAmount)

  const remainingDepositLimit = useMemo(() => {
    return parseFloat(contract?.getDepositContract?.limits?.[0]?.limitValue || "0")
  }, [contract?.getDepositContract?.limits?.[0]?.limitValue])

  const usdRemainingLimitMoneyAmount =
    typeof remainingDepositLimit === "number"
      ? convertMoneyAmount?.(toUsdMoneyAmount(remainingDepositLimit), DisplayCurrency)
      : null

  const remainingDepositLimitText = usdRemainingLimitMoneyAmount
    ? `${formatMoneyAmount({
        moneyAmount: usdRemainingLimitMoneyAmount,
      })}`
    : ""

  const onDeposit = useCallback(async () => {
    try {
      if (contract?.getDepositContract?.tokenDetails?.body) {
        const res = await executeDepositContract({
          variables: {
            input: { token: contract?.getDepositContract?.tokenDetails?.body || "" },
          },
        })
        if (res?.data?.executeDepositContract?.id) {
          setSuccess(true)
        } else if (res?.errors?.length) {
          // Capture both user-friendly and technical error messages
          setErrorMessage(LL.SinpeIBANDepositConfirmationScreen.errorMessage())
          setErrorDetails(res.errors[0]?.message || null)
        }
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(LL.SinpeIBANDepositConfirmationScreen.errorMessage()) // Fallback user-friendly error message
      setErrorDetails(null) // No technical details available for unexpected errors
    }
  }, [contract?.getDepositContract?.tokenDetails?.body, LL])

  const navigateToHomeScreen = () => {
    navigation.navigate("Primary")
    setSuccess(false)
    setErrorMessage(null) // Reset error message when navigating back
    setErrorDetails(null) // Reset error details when navigating back
  }

  return {
    state: {
      LL,
      usdWallet,
      btcWallet,
      data,
      fromAccountBalance,
      bankAccount,
      fromWalletCurrency,
      isLoading: loading || depositing,
      moneyAmount,
      btcPrice:
        bankAccount?.currency === BankAccountCurrencies.Crc
          ? btcPriceInAmount?.amount.toFixed(0)
          : btcPriceInAmount?.amount.toFixed(2),
      sellAmount,
      success,
      feesAmount,
      totalAmount:
        bankAccount?.currency === BankAccountCurrencies.Crc
          ? totalAmount.toFixed(2)
          : totalAmount.toFixed(2),
      totalAmountInSats:
        Number(contract?.getDepositContract?.amounts?.walletCredit?.amountInSats) || 0,
      remainingLimit: remainingDepositLimitText,
      canDeposit: contract?.getDepositContract?.limits?.[0]?.canExecute,
      fiatSymbol:
        displayCurrencyDictionary[bankAccount?.currency || WalletCurrency.Usd]?.symbol ||
        "",
      errorMessage, // User-friendly error message
      errorDetails, // Technical error details
    },
    actions: {
      onDeposit,
      convertMoneyAmount,
      formatMoneyAmount,
      navigateToHomeScreen,
      displayCurrency,
    },
  }
}
export default useSinpeDepositConfirmation
