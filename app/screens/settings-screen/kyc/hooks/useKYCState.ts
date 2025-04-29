import { SceneMap } from "react-native-tab-view"
import DocumentType from "../document-type"
import DocumentProof from "../document-verification"
import UserDetails from "../user-details"
import ConfirmDisclosures from "../confirm-disclosures"
import { useWindowDimensions, ScrollView } from "react-native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { gql } from "@apollo/client"
import {
  useKycDetailsQuery,
  Status,
  IdentificationType,
  Kyc,
  Gender,
  Maybe,
  InputMaybe,
  MaritalStatus,
} from "@app/graphql/generated"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { stepWidth } from "./utils"
import isEqual from "lodash.isequal"

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

export type TabProps = {
  key: string
  title: string
  setKYCDetails: (next: Partial<KYCDetails>) => void
  KYCDetails: KYCDetails
  isStepOneAndTwoCompleted?: boolean
  jumpTo: (key: number) => void
}

export interface KYCDetails {
  pep?: string
  moneyTransfers?: string
  IDType?: string
  idDetails: {
    type?: string | null | undefined
    front?: string | null | undefined
    back?: string | null | undefined
    address?: string | null | undefined
    martialStatus?: InputMaybe<MaritalStatus>
    id?: string | null | undefined
    email?: string | null | undefined
    phoneNumber?: string | null | undefined
    gender?: Maybe<Gender> | undefined
    fullName?: string | null | undefined
    citizenships?: []
    galoyUserId?: string | null | undefined
    placeOfBirth?: string | null | undefined
    status?: Kyc["status"]
    isHighRisk: string
    isPoliticallyExposed: string
  }
}

const initialKycDetails: KYCDetails = {
  pep: "yes",
  moneyTransfers: "yes",
  IDType: "",
  idDetails: {
    type: "",
    front: "",
    back: "",
    address: "",
    martialStatus: undefined,
    id: "",
    email: "",
    phoneNumber: "",
    isHighRisk: "no",
    isPoliticallyExposed: "no",
  },
}

const renderScene = SceneMap({
  docType: DocumentType,
  docProof: DocumentProof,
  user: UserDetails,
  confirm: ConfirmDisclosures,
})

const useKYCState = () => {
  const [KYCDetails, _setKYCDetails] = useState<KYCDetails>(initialKycDetails)
  const [index, setIndex] = useState(0)
  const layout = useWindowDimensions()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const scrollRef = useRef<ScrollView>(null)

  const { data, loading } = useKycDetailsQuery({ fetchPolicy: "network-only" })
  const setKYCDetails = useCallback((next: Partial<KYCDetails>) => {
    _setKYCDetails((prevDetails) => {
      // Filter out undefined properties from `next`
      const filteredNext = {
        ...next,
        idDetails: Object.fromEntries(
          Object.entries(next.idDetails || {}).filter(
            ([_, value]) => value !== undefined,
          ),
        ),
      }

      const updatedDetails = {
        ...prevDetails,
        ...filteredNext,
        idDetails: {
          ...prevDetails.idDetails,
          ...filteredNext.idDetails,
          id:
            filteredNext.idDetails?.id === "" || filteredNext.idDetails?.id === undefined
              ? prevDetails.idDetails?.id // Preserve existing id if new value is invalid
              : filteredNext.idDetails?.id,
        },
      }

      // Only update if there are actual changes
      if (isEqual(prevDetails, updatedDetails)) {
        return prevDetails // Return the previous state to avoid unnecessary updates
      }
      return updatedDetails
    })
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
      const isFrontSide = primaryIdentification?.files?.[0]
      const isBackSide = primaryIdentification?.files?.[1]
      const updatedDetails = {
        idDetails: {
          type: primaryIdentification?.type,
          front:
            isDrivingLicense && isFrontSide && isBackSide
              ? isFrontSide
              : isDrivingLicense
                ? null
                : isFrontSide,
          back:
            isDrivingLicense && isFrontSide && isBackSide
              ? isBackSide
              : isDrivingLicense
                ? null
                : isBackSide,
          email: kyc?.email,
          phoneNumber: kyc?.phoneNumber,
          id:
            kyc?.id === "" || kyc?.id === undefined
              ? KYCDetails.idDetails?.id // Preserve existing id if new value is invalid
              : kyc?.id,
          gender: kyc?.gender,
          isPoliticallyExposed: kyc?.isPoliticallyExposed ? "yes" : "no",
          isHighRisk: kyc?.isHighRisk ? "yes" : "no",
        },
      }

      // Only update if there are actual changes
      if (isEqual(KYCDetails.idDetails, updatedDetails.idDetails)) {
        console.log("useEffect: No changes detected, skipping update")
      } else {
        console.log("useEffect: Updating KYCDetails", updatedDetails)
        setKYCDetails(updatedDetails)
      }
    }
  }, [
    loading,
    primaryIdentification?.files,
    primaryIdentification?.type,
    isDrivingLicense,
    kyc?.email,
    kyc?.phoneNumber,
    kyc?.id,
    kyc?.gender,
    kyc?.isPoliticallyExposed,
    kyc?.isHighRisk,
    setKYCDetails, // Dependency to track changes
  ])

  const jumpTo = (targetIndex: number) => {
    scrollRef.current?.scrollTo({
      x: stepWidth * targetIndex,
    })
    setIndex(targetIndex)
  }

  useEffect(() => {
    if (kyc?.status === Status.Pending && !loading) {
      const isFrontSide = primaryIdentification?.files?.[0]
      const isBackSide = primaryIdentification?.files?.[1]
      if (
        KYCDetails?.idDetails?.type &&
        ((isDrivingLicense && isFrontSide && isBackSide) ||
          (!isDrivingLicense && isFrontSide))
      ) {
        jumpTo(2)
        if (
          KYCDetails?.idDetails?.email &&
          KYCDetails?.idDetails?.phoneNumber &&
          KYCDetails?.idDetails?.gender
        ) {
          jumpTo(3)
        }
      }
    }
  }, [loading, kyc?.status, isFocused, KYCDetails?.idDetails?.type])

  const isStepOneAndTwoCompleted = useMemo(() => {
    return (
      Boolean(primaryIdentification?.type) &&
      Boolean(primaryIdentification?.files) &&
      Boolean(
        (KYCDetails?.idDetails?.type === IdentificationType.DrivingLicense &&
          KYCDetails?.idDetails?.front &&
          KYCDetails?.idDetails?.back) ||
          (KYCDetails?.idDetails?.type !== IdentificationType.DrivingLicense &&
            KYCDetails?.idDetails?.front),
      )
    )
  }, [
    primaryIdentification?.type,
    primaryIdentification?.files,
    KYCDetails?.idDetails?.type,
    KYCDetails?.idDetails?.front,
    KYCDetails?.idDetails?.back,
  ])

  const onBack = useCallback(() => {
    if (index === 0) {
      navigation.goBack()
    } else {
      jumpTo(index - 1)
    }
  }, [index, navigation, isStepOneAndTwoCompleted])

  return {
    state: { KYCDetails, loading, layout, index, isStepOneAndTwoCompleted, scrollRef },
    actions: { setIndex, setKYCDetails, renderScene, onBack, jumpTo },
  }
}

export type UseKYCStateReturnType = ReturnType<typeof useKYCState>

export default useKYCState
