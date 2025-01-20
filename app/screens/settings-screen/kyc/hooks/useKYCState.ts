import { SceneMap, SceneRendererProps } from "react-native-tab-view"
import DocumentType from "../document-type"
import DocumentProof from "../document-verification"
import UserDetails from "../user-details"
import ConfirmDisclosures from "../confirm-disclosures"
import { useWindowDimensions } from "react-native"
import { useCallback, useEffect, useState } from "react"
import { gql } from "@apollo/client"
import { useKycDetailsQuery } from "@app/graphql/generated"

gql`
  query KycDetails {
    me {
      username
      kyc {
        fullName
        citizenships
        email
        phoneNumber
        gender
        isPoliticallyExposed
        isHighRisk
        primaryIdentification {
          expiration
          files
          type
        }
      }
    }
  }
`

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
  const { data, loading } = useKycDetailsQuery()
  const setState = useCallback((next) => {
    _setState((perv) => ({ ...perv, ...next }))
  }, [])

  useEffect(() => {
    if (!loading) {
      const kyc = data?.me?.kyc
      setState({
        idDetails: {
          type: kyc?.primaryIdentification?.type,
          front: kyc?.primaryIdentification?.files?.[0],
          back: kyc?.primaryIdentification?.files?.[1],
          email: kyc?.email,
          phoneNumber: kyc?.phoneNumber,
          gender: kyc?.gender,
          isPoliticallyExposed: kyc?.isPoliticallyExposed,
          isHighRisk: kyc?.isHighRisk,
        },
      })
    }
  }, [loading, data, setState])

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
