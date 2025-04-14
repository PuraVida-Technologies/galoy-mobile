import { useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useRef, useState } from "react"
import { prepareKYCDetails } from "./utils"
import crashlytics from "@react-native-firebase/crashlytics"
import { gql } from "@apollo/client"
import { KycDetailsDocument, useUpdateKycMutation } from "@app/graphql/generated"
import { UseKYCStateReturnType } from "./useKYCState"

gql`
  mutation updateKYC($input: InputKyc!) {
    updateKyc(input: $input) {
      id
    }
  }
`

interface Props {
  KYCDetails: UseKYCStateReturnType["state"]["KYCDetails"]
  setKYCDetails: UseKYCStateReturnType["actions"]["setKYCDetails"]
}

const useConfirmKYC = ({ KYCDetails, setKYCDetails }: Props) => {
  const [isPoliticallyExposed, setPoliticallyExposed] = useState("yes")
  const [isHighRisk, setIsHighRisk] = useState("yes")
  const [loading, setLoading] = useState(false)
  const [updateKYCDetails] = useUpdateKycMutation({
    refetchQueries: [KycDetailsDocument],
  })
  const navigation = useNavigation()
  const stateRef = useRef(KYCDetails)

  // Update stateRef whenever KYCDetails changes
  useEffect(() => {
    stateRef.current = KYCDetails
  }, [KYCDetails])

  useEffect(() => {
    setPoliticallyExposed(KYCDetails?.idDetails?.isPoliticallyExposed)
    setIsHighRisk(KYCDetails?.idDetails?.isHighRisk)
  }, [KYCDetails])

  const onPepChange = (value?: string) => {
    setPoliticallyExposed(value || "no")
    setKYCDetails({
      idDetails: { ...KYCDetails?.idDetails, isPoliticallyExposed: value || "no" },
    })
  }

  const onHighRiskChange = (value?: string) => {
    setIsHighRisk(value || "no")
    setKYCDetails({
      idDetails: { ...KYCDetails?.idDetails, isHighRisk: value || "no" },
    })
  }

  const onConfirm = useCallback(async () => {
    setLoading(true)
    try {
      const input = prepareKYCDetails(stateRef.current)
      await updateKYCDetails({
        variables: {
          input,
        },
      })
    } catch (err) {
      if (err instanceof Error) {
        crashlytics().recordError(err)
      }
    }

    setLoading(false)
    navigation.goBack()
  }, [navigation, updateKYCDetails])

  return {
    state: { isPoliticallyExposed, isHighRisk, loading },
    actions: {
      setPoliticallyExposed,
      setIsHighRisk,
      onPepChange,
      onHighRiskChange,
      onConfirm,
    },
  }
}

export default useConfirmKYC
