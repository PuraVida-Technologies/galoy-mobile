import { gql } from "@apollo/client"
import {
  HomeAuthedDocument,
  useConversionScreenQuery,
  useExecuteWithdrawalContractMutation,
  useGetWithdrawalContractLazyQuery,
  WalletCurrency,
} from "@app/graphql/generated"
import { useIsAuthed } from "@app/graphql/is-authed-context"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useNavigation } from "@react-navigation/native"
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
  const navigation = useNavigation()
  const { formatMoneyAmount, displayCurrency } = useDisplayCurrency()
  const { convertMoneyAmount } = usePriceConversion()
  const interval = useRef<NodeJS.Timeout>()

  const { fromWalletCurrency, moneyAmount, fromAccountBalance, wallet, bankAccount } =
    route.params
  const [accountDefaultWalletQuery, { data: contract, loading, error }] =
    useGetWithdrawalContractLazyQuery({
      variables: {
        input: {
          amount: (moneyAmount?.amount * 100).toString(),
          bankAccountId: bankAccount?.id,
          targetCurrency: WalletCurrency.Usd,
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
  }, [accountDefaultWalletQuery])

  useEffect(() => {
    if (success) {
      clearInterval(interval.current)
    }
  }, [success, interval.current])

  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const isAuthed = useIsAuthed()

  const isLoading = false
  const { LL } = useI18nContext()

  const { data } = useConversionScreenQuery({
    fetchPolicy: "cache-first",
    skip: !isAuthed,
  })

  const btcWallet = getBtcWallet(data?.me?.defaultAccount?.wallets)
  const usdWallet = getUsdWallet(data?.me?.defaultAccount?.wallets)

  const fromWallet = useMemo(() => {
    if (fromWalletCurrency === WalletCurrency.Btc) {
      return { id: btcWallet?.id, currency: WalletCurrency.Btc }
    }
    return { id: usdWallet?.id, currency: WalletCurrency.Usd }
  }, [btcWallet?.id, fromWalletCurrency, usdWallet?.id])

  const toWallet = useMemo(() => {
    if (fromWalletCurrency === WalletCurrency.Btc) {
      return { id: usdWallet?.id, currency: WalletCurrency.Usd }
    }
    return { id: btcWallet?.id, currency: WalletCurrency.Btc }
  }, [btcWallet?.id, fromWalletCurrency, usdWallet?.id])

  const fromAmount = convertMoneyAmount?.(moneyAmount, fromWallet.currency)
  const toAmount = convertMoneyAmount?.(moneyAmount, toWallet.currency)

  const btcPriceInUsd = useMemo(() => {
    return (
      (contract?.getWithdrawalContract?.amounts?.target?.btcSatPrice || 0) * 1000000
    ).toFixed(2)
  }, [contract?.getWithdrawalContract?.amounts?.target?.btcSatPrice])

  const sellAmountInBtc = useMemo(() => {
    return ((contract?.getWithdrawalContract.amounts.target.amount || 0) / 100).toFixed(2)
  }, [contract?.getWithdrawalContract?.amounts?.target?.amount])
  const feesInUSD = useMemo(() => {
    return ((contract?.getWithdrawalContract.amounts.fee.amount || 0) / 100).toFixed(2)
  }, [contract?.getWithdrawalContract.amounts.fee.amount])
  const totalInUSD = useMemo(() => {
    return (
      (contract?.getWithdrawalContract.amounts.walletDebit.amount || 0) / 100
    ).toFixed(2)
  }, [contract?.getWithdrawalContract.amounts.walletDebit.amount])

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
      fromAmount,
      toAmount,
      usdWallet,
      btcWallet,
      data,
      fromAccountBalance,
      bankAccount,
      fromWalletCurrency,
      errorMessage,
      isLoading: isLoading || loading || withdrawing,
      moneyAmount,
      fromWallet,
      toWallet,
      btcPriceInUsd,
      sellAmountInBtc,
      success,
      feesInUSD,
      totalInUSD,
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
