import { SceneMap, SceneRendererProps } from "react-native-tab-view"
import DocumentType from "../document-type"
import DocumentProof from "../document-verification"
import UserDetails from "../user-details"
import ConfirmDisclosures from "../confirm-disclosures"
import { useWindowDimensions } from "react-native"
import { useCallback, useEffect, useMemo, useState } from "react"
import { gql } from "@apollo/client"
import { useKycDetailsQuery, Status, IdentificationType } from "@app/graphql/generated"
import { useNavigation } from "@react-navigation/native"

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
  const navigation = useNavigation()
  const { data, loading } = useKycDetailsQuery({ fetchPolicy: "network-only" })
  const setState = useCallback((next) => {
    _setState((perv) => ({ ...perv, ...next }))
  }, [])

  const { kyc, primaryIdentification, isDrivingLicense } = useMemo(() => {
    const kyc = data?.me?.kyc
    const primaryIdentification = Array.isArray(kyc?.primaryIdentification)
      ? kyc?.primaryIdentification?.at?.(-1)
      : kyc?.primaryIdentification
    const isDrivingLicense =
      primaryIdentification?.type === IdentificationType.DrivingLicense
    return { kyc, primaryIdentification, isDrivingLicense }
  }, [data?.me?.kyc])

  useEffect(() => {
    if (!loading) {
      const isForntSide = primaryIdentification?.files?.[0]
      const isBackSide = primaryIdentification?.files?.[1]
      setState({
        idDetails: {
          type: primaryIdentification?.type,
          front:
            isDrivingLicense && isForntSide && isBackSide
              ? isForntSide
              : !isDrivingLicense
                ? isForntSide
                : "",
          back:
            isDrivingLicense && isForntSide && isBackSide
              ? isBackSide
              : !isDrivingLicense
                ? isBackSide
                : "",
          email: kyc?.email,
          phoneNumber: kyc?.phoneNumber,
          id: kyc?.id,
          gender: kyc?.gender,
          isPoliticallyExposed: kyc?.isPoliticallyExposed,
          isHighRisk: kyc?.isHighRisk,
        },
      })
    }
  }, [
    loading,
    data,
    setState,
    primaryIdentification?.files,
    primaryIdentification?.type,
    isDrivingLicense,
    kyc?.email,
    kyc?.phoneNumber,
    kyc?.id,
    kyc?.gender,
    kyc?.isPoliticallyExposed,
    kyc?.isHighRisk,
  ])

  const routes = [
    { key: "docType", title: "Document Type", setState, state },
    { key: "docProof", title: "Document Proof", setState, state },
    { key: "user", title: "User", setState, state },
    { key: "confirm", title: "Confirm Disclosures", setState, state },
  ]

  useEffect(() => {
    if (kyc?.status === Status.Pending) {
      const isForntSide = primaryIdentification?.files?.[0]
      const isBackSide = primaryIdentification?.files?.[1]
      if (
        state?.idDetails?.type &&
        ((isDrivingLicense && isForntSide && isBackSide) ||
          (!isDrivingLicense && isForntSide))
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
  }, [state, kyc, primaryIdentification?.files, isDrivingLicense])

  const isStepOneAndTwoCompleted = useMemo(() => {
    return (
      Boolean(primaryIdentification?.type) &&
      Boolean(primaryIdentification?.files) &&
      Boolean(
        (state?.idDetails?.type === IdentificationType.DrivingLicense &&
          state?.idDetails?.front &&
          state?.idDetails?.back) ||
          (state?.idDetails?.type !== IdentificationType.DrivingLicense &&
            state?.idDetails?.front),
      )
    )
  }, [
    primaryIdentification?.type,
    primaryIdentification?.files,
    state?.idDetails?.type,
    state?.idDetails?.front,
    state?.idDetails?.back,
  ])

  const onBack = useCallback(() => {
    if (isStepOneAndTwoCompleted) {
      navigation.goBack()
    } else if (index === 0) {
      navigation.goBack()
    } else {
      setIndex(index - 1)
    }
  }, [index, navigation, isStepOneAndTwoCompleted])

  return {
    state: { state, routes, layout, index, isStepOneAndTwoCompleted },
    actions: { setIndex, setState, renderScene, onBack },
  }
}

export default useKYCState
