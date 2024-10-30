import { SceneMap, SceneRendererProps } from "react-native-tab-view"
import DocumentType from "../document-type"
import DocumentProof from "../document-verification"
import UserDetails from "../user-details"
import ConfirmDisclosures from "../confirm-disclosures"
import { useWindowDimensions } from "react-native"
import { useCallback, useState } from "react"

export interface Route extends Omit<SceneRendererProps, "layout"> {
  route: any
}

const renderScene = SceneMap({
  docType: DocumentType,
  docProof: DocumentProof,
  user: UserDetails,
  confirm: ConfirmDisclosures,
})

const useKYCState = () => {
  const [state, _setState] = useState({ pep: "yes", moneyTransfers: "yes" })
  const [index, setIndex] = useState(0)
  const layout = useWindowDimensions()

  const setState = useCallback((next) => {
    _setState((perv) => ({ ...perv, ...next }))
  }, [])

  const routes = [
    { key: "docType", title: "Document Type", setState, state },
    { key: "docProof", title: "Document Proof", setState, state },
    { key: "user", title: "User", setState, state },
    { key: "confirm", title: "Confirm Disclosures", setState, state },
  ]

  return {
    state: { state, routes, layout, index },
    actions: { setIndex, setState, renderScene },
  }
}

export default useKYCState
