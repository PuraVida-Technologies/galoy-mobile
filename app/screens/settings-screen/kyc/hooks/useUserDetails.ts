import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import crashlytics from "@react-native-firebase/crashlytics"
import { KycDetailsDocument, useUpdateKycMutation } from "@app/graphql/generated"
import { prepareUserDetails } from "./utils"
import { UseKYCStateReturnType } from './useKYCState'

type UserDetails = {
  gender?: string | null
  phoneNumber?: string | null
  email?: string | null
}

interface Props {
  state: UseKYCStateReturnType["state"]["state"]
  setState: UseKYCStateReturnType["actions"]["setState"]
}

const useUserDetails = ({ state, setState }: Props) => {
  const [userDetails, _setUserDetails] = useState<UserDetails>({
    gender: "MALE",
    phoneNumber: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [updateKYCDetails] = useUpdateKycMutation({
    refetchQueries: [KycDetailsDocument],
  })
  const stateRef = useRef(userDetails)

  const setUserDetails = useCallback((next: UserDetails) => {
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
        idDetails: { id: state?.idDetails?.id, ...stateRef.current },
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
