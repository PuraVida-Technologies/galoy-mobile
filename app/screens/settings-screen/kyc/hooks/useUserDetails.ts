import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import crashlytics from "@react-native-firebase/crashlytics"
import { useUpdateKycMutation } from "@app/graphql/generated"
import { prepareUserDetails } from "./utils"

const useUserDetails = ({ state, setState }) => {
  const [userDetails, _setUserDetails] = useState({
    gender: "MALE",
    phoneNumber: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [updateKYCDetails] = useUpdateKycMutation({ refetchQueries: ["KycDetails"] })
  const stateRef = useRef(userDetails)

  const setUserDetails = useCallback((next) => {
    _setUserDetails((prev) => {
      const data = { ...prev, ...next }
      stateRef.current = data
      return data
    })
  }, [])

  useEffect(() => {
    setUserDetails({
      email: state?.idDetails?.email,
      phoneNumber: state?.idDetails?.phoneNumber,
      gender: state?.idDetails?.gender,
    })
  }, [state?.idDetails])

  const onConfirm = useCallback(async () => {
    setLoading(true)

    try {
      setState({ idDetails: { ...state?.idDetails, ...stateRef.current } })
      const input = prepareUserDetails({
        idDetails: { id: state.idDetails.id, ...stateRef.current },
      })

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
  }, [state, userDetails, stateRef.current, updateKYCDetails])

  const allowed = useMemo(
    () => Boolean(userDetails?.email && userDetails?.phoneNumber && userDetails?.gender),
    [userDetails?.email, userDetails?.gender, userDetails?.phoneNumber],
  )

  return {
    state: { loading, userDetails, allowed },
    actions: {
      onConfirm,
      setUserDetails,
    },
  }
}

export default useUserDetails
