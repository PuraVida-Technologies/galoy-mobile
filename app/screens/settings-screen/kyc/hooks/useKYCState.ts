import { SceneMap, SceneRendererProps } from "react-native-tab-view"
import DocumentType from "../document-type"
import DocumentProof from "../document-verification"
import UserDetails from "../user-details"
import ConfirmDisclosures from "../confirm-disclosures"
import { useWindowDimensions } from "react-native"
import { useCallback, useEffect, useState } from "react"
import { gql } from "@apollo/client"
import { useKycDetailsQuery, Status, IdentificationType } from "@app/graphql/generated"

gql`
  query KycDetails {
    me {
      username
      kyc {
        id
        status
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
      const isDrivingLicense =
        kyc?.primaryIdentification?.type === IdentificationType.DrivingLicense
      const isForntSide = kyc?.primaryIdentification?.files?.[0]
      const isBackSide = kyc?.primaryIdentification?.files?.[0]
      setState({
        idDetails: {
          type: kyc?.primaryIdentification?.type,
          front: isDrivingLicense && isForntSide && isBackSide ? isForntSide : "",
          back: isDrivingLicense && isForntSide && isBackSide ? isBackSide : "",
          email: kyc?.email,
          phoneNumber: kyc?.phoneNumber,
          id: kyc?.id,
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

  useEffect(() => {
    if (data?.me?.kyc?.status === Status.Pending) {
      if (state?.idDetails?.type) {
        setIndex(1)
      }
      if (
        (state?.idDetails?.type === IdentificationType.DrivingLicense &&
          state?.idDetails?.front &&
          state?.idDetails?.back) ||
        (state?.idDetails?.type !== IdentificationType.DrivingLicense &&
          state?.idDetails?.front)
      ) {
        setIndex(2)
      }
      if (
        state?.idDetails?.email &&
        state?.idDetails?.phoneNumber &&
        state?.idDetails?.gender
      ) {
        setIndex(3)
      }
    }
  }, [state, data?.me?.kyc?.status])

  return {
    state: { state, routes, layout, index },
    actions: { setIndex, setState, renderScene },
  }
}

export default useKYCState
