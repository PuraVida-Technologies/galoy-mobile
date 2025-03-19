import { gql } from "@apollo/client"
import {
  HomeAuthedDocument,
  useExecuteWithdrawalContractMutation,
  useGetWithdrawalContractLazyQuery,
  WalletCurrency,
} from "@app/graphql/generated"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import useWallet from "@app/hooks/use-wallet"
import { useI18nContext } from "@app/i18n/i18n-react"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { DisplayCurrency, toUsdMoneyAmount } from "@app/types/amounts"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

gql`
  mutation ExecuteWithdrawalContract($input: ExecuteWithdrawalContract!) {
    executeWithdrawalContract(input: $input) {
      id
    }
  }
`

gql`
  query getWithdrawalContract($input: GetWithDrawalContractInput!) {
    getWithdrawalContract(input: $input) {
      amounts {
        bankAccountCredit {
          amount
          amountInSats
          btcSatPrice
          currency
          resolvedAt
        }
        fee {
          amount
          amountInSats
          btcSatPrice
          currency
          resolvedAt
        }
        target {
          amount
          amountInSats
          btcSatPrice
          currency
          resolvedAt
        }
        walletDebit {
          amount
          amountInSats
          btcSatPrice
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
            accountHolderName
            nationalId
            iban
            sinpeCode
            swiftCode
            currency
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
  route: RouteProp<RootStackParamList, "snipeConfirmation">
}

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

const useSnipeConfirmation = ({ route }: Props) => {
  const [success, setSuccess] = useState(false)
  const interval = useRef<NodeJS.Timeout>()
  const { LL } = useI18nContext()

  // Navigation and params
  const navigation = useNavigation()
  const { fromWalletCurrency, moneyAmount, fromAccountBalance, wallet, bankAccount } =
    route.params

  const { data, isAuthed, btcWallet, usdWallet } = useWallet()

  const { formatMoneyAmount, moneyAmountToMajorUnitOrSats, fiatSymbol, displayCurrency } =
    useDisplayCurrency()

  const { convertMoneyAmount } = usePriceConversion()

  const [accountDefaultWalletQuery, { data: contract, loading, error }] =
    useGetWithdrawalContractLazyQuery({
      variables: {
        input: {
          amount: (moneyAmount?.amount * 100).toString(),
          bankAccountId: bankAccount?.id,
          targetCurrency: bankAccount?.currency,
          sourceCurrency: displayCurrency,
          walletId: wallet.id,
        },
      },
    })
  const [executeWithdrawalContract, { data: withdrawal, loading: withdrawing }] =
    useExecuteWithdrawalContractMutation({
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

  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const btcPriceInAmount = convertMoneyAmount?.(
    {
      amount:
        parseFloat(contract?.getWithdrawalContract?.amounts?.target?.btcSatPrice || "0") *
        1000000,
      currency: WalletCurrency.Usd,
      currencyCode: "USD",
    },
    DisplayCurrency,
  )

  const sellAmount = moneyAmountToMajorUnitOrSats({
    amount: parseFloat(contract?.getWithdrawalContract.amounts.target.amount || "0"),
    currency: WalletCurrency.Usd,
    currencyCode: "USD",
  })

  const sellMoneyAmount = convertMoneyAmount?.(
    { amount: sellAmount, currency: WalletCurrency.Usd, currencyCode: "USD" },
    DisplayCurrency,
  )

  const feesAmount = moneyAmountToMajorUnitOrSats({
    amount: parseFloat(contract?.getWithdrawalContract.amounts.fee.amount || "0"),
    currency: WalletCurrency.Usd,
    currencyCode: "USD",
  })

  const feesMoneyAmount = convertMoneyAmount?.(
    { amount: feesAmount, currency: WalletCurrency.Usd, currencyCode: "USD" },
    DisplayCurrency,
  )

  const totalAmount = formatMoneyAmount({
    moneyAmount: convertMoneyAmount?.(
      {
        amount: parseFloat(
          contract?.getWithdrawalContract.amounts.walletDebit.amount || "0",
        ),
        currency:
          contract?.getWithdrawalContract.amounts.walletDebit.currency ||
          fromWalletCurrency,
        currencyCode:
          contract?.getWithdrawalContract.amounts.walletDebit.currency ||
          fromWalletCurrency,
      },
      DisplayCurrency,
    ) || {
      amount: 0,
      currency: DisplayCurrency,
      currencyCode: "BTC",
    },
    noSymbol: true,
  })

  const remainingLimit = useMemo(() => {
    return parseFloat(contract?.getWithdrawalContract?.limits?.[0]?.limitValue || "0")
  }, [contract?.getWithdrawalContract?.limits?.[0]?.limitValue])

  const usdRemainingLimitMoneyAmount =
    typeof remainingLimit === "number"
      ? convertMoneyAmount?.(toUsdMoneyAmount(remainingLimit), DisplayCurrency)
      : null

  const remainingLimitText = usdRemainingLimitMoneyAmount
    ? `${formatMoneyAmount({
        moneyAmount: usdRemainingLimitMoneyAmount,
      })}`
    : ""

  const onWithdraw = useCallback(async () => {
    try {
      if (contract?.getWithdrawalContract?.tokenDetails?.body) {
        const res = await executeWithdrawalContract({
          variables: {
            input: { token: contract?.getWithdrawalContract?.tokenDetails?.body || "" },
          },
        })
        if (res?.data?.executeWithdrawalContract?.id) {
          setSuccess(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [contract?.getWithdrawalContract?.tokenDetails?.body])

  const navigateToHomeScreen = () => {
    navigation.navigate("Primary")
    setSuccess(false)
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
      errorMessage,
      isLoading: loading || withdrawing,
      moneyAmount,
      btcPrice: btcPriceInAmount?.amount,
      sellAmount: sellMoneyAmount?.amount,
      success,
      feesAmount: feesMoneyAmount?.amount,
      totalAmount: parseFloat(totalAmount.replace(/,/g, "")),
      remainingLimit: remainingLimitText,
      canWithdraw: contract?.getWithdrawalContract?.limits?.[0]?.canExecute,
      fiatSymbol,
    },
    actions: {
      onWithdraw,
      convertMoneyAmount,
      formatMoneyAmount,
      navigateToHomeScreen,
      displayCurrency,
    },
  }
}
export default useSnipeConfirmation
