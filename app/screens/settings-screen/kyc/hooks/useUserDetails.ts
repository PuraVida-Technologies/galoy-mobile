import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import crashlytics from "@react-native-firebase/crashlytics"
import {
  Gender,
  KycDetailsDocument,
  Maybe,
  useUpdateKycMutation,
} from "@app/graphql/generated"
import { prepareUserDetails } from "./utils"
import { UseKYCStateReturnType } from "./useKYCState"

type UserDetails = {
  gender?: Maybe<Gender>
  phoneNumber?: string | null
  email?: string | null
}

interface Props {
  KYCDetails: UseKYCStateReturnType["state"]["KYCDetails"]
  setKYCDetails: UseKYCStateReturnType["actions"]["setKYCDetails"]
}

const useUserDetails = ({ KYCDetails, setKYCDetails }: Props) => {
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
      email: KYCDetails?.idDetails?.email,
      phoneNumber: KYCDetails?.idDetails?.phoneNumber,
      gender: KYCDetails?.idDetails?.gender,
    })
  }, [KYCDetails?.idDetails])

  const onConfirm = useCallback(async () => {
    setLoading(true)

    try {
      setKYCDetails({ idDetails: { ...KYCDetails?.idDetails, ...stateRef.current } })
      const input = prepareUserDetails({
        idDetails: { id: KYCDetails?.idDetails?.id, ...stateRef.current },
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
  }, [KYCDetails, userDetails, stateRef.current, updateKYCDetails])

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
