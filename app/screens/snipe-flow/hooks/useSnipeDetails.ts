import { WalletCurrency } from "@app/graphql/generated"
import { useState } from "react"

const useSnipeDetails = () => {
  const [from, setFrom] = useState<WalletCurrency>(WalletCurrency.Btc)
  const [openFromSelection, setFromSelection] = useState<boolean>(false)
  return {
    state: {
      from,
      openFromSelection,
    },
    actions: {
      setFrom,
      setFromSelection,
    },
  }
}
export default useSnipeDetails
