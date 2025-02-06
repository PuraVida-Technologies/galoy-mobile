import { WalletCurrency } from "@app/graphql/generated"
import { useState } from "react"

const useSnipeDetails = () => {
  const [from, setFrom] = useState<WalletCurrency>(WalletCurrency.Btc)
  const [openFromSelection, setFromSelection] = useState<boolean>(false)
  const [paymentDetail, setPaymentDetail] = useState(null)
  return {
    state: {
      from,
      openFromSelection,
      paymentDetail,
    },
    actions: {
      setFrom,
      setFromSelection,
      setPaymentDetail,
    },
  }
}
export default useSnipeDetails
