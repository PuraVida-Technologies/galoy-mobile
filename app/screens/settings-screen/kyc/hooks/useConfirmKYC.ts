import { useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useRef, useState } from "react"
import { prepareKYCDetails } from "./utils"
import crashlytics from "@react-native-firebase/crashlytics"
import { gql } from "@apollo/client"
import { useUpdateKycMutation } from "@app/graphql/generated"

gql`
  mutation updateKYC($input: InputKyc!) {
    updateKyc(input: $input) {
      id
    }
  }
`

const useConfirmKYC = ({ state, setState }) => {
  const [isPoliticallyExposed, setPoliticallyExposed] = useState("yes")
  const [isHighRisk, setIsHighRisk] = useState("yes")
  const [loading, setLoading] = useState(false)
  const [updateKYCDetails] = useUpdateKycMutation()
  const navigation = useNavigation()
  const stateRef = useRef(state)

  useEffect(() => {
    setPoliticallyExposed(state?.idDetails?.isPoliticallyExposed ? "yes" : "no")
    setIsHighRisk(state?.idDetails?.isHighRisk ? "yes" : "no")
    stateRef.current = state
  }, [state])

  const onPepChange = (value: string) => {
    setPoliticallyExposed(value)
    setState({
      idDetails: { ...state?.idDetails, isPoliticallyExposed: value === "yes" },
    })
  }

  const onHighRiskChange = (value: string) => {
    setIsHighRisk(value)
    setState({
      idDetails: { ...state?.idDetails, isHighRisk: value === "yes" },
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
  }, [state, updateKYCDetails])

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
