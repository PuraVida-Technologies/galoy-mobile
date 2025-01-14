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
  const [isPoliticallyExposed, setPoliticallyExposed] = useState(true)
  const [isHighRisk, setIsHighRisk] = useState(true)
  const [loading, setLoading] = useState(false)
  const [updateKYCDetails] = useUpdateKycMutation()
  const navigation = useNavigation()
  const stateRef = useRef(state)

  useEffect(() => {
    setPoliticallyExposed(state?.idDetails?.isPoliticallyExposed)
    setIsHighRisk(state?.idDetails?.isHighRisk)
    stateRef.current = state
  }, [state])

  const onPepChange = (value) => {
    setPoliticallyExposed(value)
    setState({
      idDetails: { ...state?.idDetails, isPoliticallyExposed: value },
    })
  }

  const onHighRiskChange = (value) => {
    setIsHighRisk(value)
    setState({
      idDetails: { ...state?.idDetails, isHighRisk: value },
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
    state: { isPoliticallyExposed, isHighRisk },
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
