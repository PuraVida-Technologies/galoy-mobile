import { gql } from "@apollo/client"
import { useConversionScreenQuery, WalletCurrency } from "@app/graphql/generated"
import { useIsAuthed } from "@app/graphql/is-authed-context"
import { getBtcWallet, getUsdWallet } from "@app/graphql/wallets-utils"
import { usePriceConversion } from "@app/hooks"
import { useDisplayCurrency } from "@app/hooks/use-display-currency"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useMemo, useState } from "react"

gql`
  query getWithdrawalContract(
    $bankAccountId: String!
    $sourceWalletId: String!
    $targetAmount: BigDecimal!
    $targetCurrency: AnyCurrency
  ) {
    getWithdrawalContract(
      input: {
        bankAccountId: $bankAccountId
        sourceWalletId: $sourceWalletId
        targetAmount: $targetAmount
        targetCurrency: $targetCurrency
      }
    ) {
      amounts
      bankAccount
      exchangeWallet
      feeExplanation
      id
      sourceWallet
      tokenDetails
    }
  }
`

gql`
  mutation executeWithdrawalContract($token: String!) {
    executeWithdrawalContract(input: { token: $token }) {
      amounts
      bankAccount
      bankAccountTransaction
      exchangeWallet
      feeExplanation
      id
      sourceWallet
      sourceWalletTransaction
      tokenDetails
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
  const { formatMoneyAmount, displayCurrency } = useDisplayCurrency()
  const { convertMoneyAmount } = usePriceConversion()

  const { fromWalletCurrency, moneyAmount, fromAccountBalance, bankAccount } =
    route.params
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

  const payWallet = async () => {
    console.log("clicked")
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
      isLoading,
      moneyAmount,
      fromWallet,
      toWallet,
    },
    actions: {
      payWallet,
      convertMoneyAmount,
      formatMoneyAmount,
      displayCurrency,
    },
  }
}
export default useSnipeConfirmation
