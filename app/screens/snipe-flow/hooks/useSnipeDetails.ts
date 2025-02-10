import { WalletCurrency } from "@app/graphql/generated"
import { useState } from "react"

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

  return {
    state: {
      from,
      openFromSelection,
      paymentDetail,
      openBankSelection,
      selectedBank,
      searchText,
      matchingAccounts,
      amount,
    },
    actions: {
      setFrom,
      setFromSelection,
      setPaymentDetail,
      setOpenBankSelection,
      setSelectedBank,
      setSearchText,
      setMatchingAccounts,
      setAmount,
    },
  }
}
export default useSnipeDetails
