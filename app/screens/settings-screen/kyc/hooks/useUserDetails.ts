import { useCallback, useEffect, useMemo, useState } from "react"
import { Gender, KycDetailsDocument, useUpdateKycMutation } from "@app/graphql/generated"
import crashlytics from "@react-native-firebase/crashlytics"
import { UseKYCStateReturnType } from "./useKYCState"
import { useForm } from "react-hook-form"
import { prepareUserDetails } from "./utils"

type UserDetails = {
  gender?: Gender | null
  phoneNumber?: string | null
  email?: string | null
}

interface Props {
  KYCDetails: UseKYCStateReturnType["state"]["KYCDetails"]
  jumpTo: UseKYCStateReturnType["actions"]["jumpTo"]
  setKYCDetails: UseKYCStateReturnType["actions"]["setKYCDetails"]
}

const defaultDetails = { email: "", phoneNumber: "", gender: Gender.Male }

const useUserDetails = ({ KYCDetails, jumpTo, setKYCDetails }: Props) => {
  const [loading, setLoading] = useState(false)
  const [updateKYCDetails] = useUpdateKycMutation({
    refetchQueries: [KycDetailsDocument],
  })

  const { handleSubmit, reset, getValues, control, watch } = useForm<UserDetails>({
    defaultValues: { ...defaultDetails },
  })

  const values = watch()

  useEffect(() => {
    reset({
      ...getValues(),
      email: KYCDetails?.idDetails?.email || "",
      phoneNumber: KYCDetails?.idDetails?.phoneNumber || "",
      gender: KYCDetails?.idDetails?.gender || Gender.Male,
    })
  }, [KYCDetails?.idDetails])

  const onConfirm = useCallback(
    async (data: UserDetails) => {
      setLoading(true)

      try {
        setKYCDetails({ idDetails: { ...KYCDetails?.idDetails, ...data } })
        const input = prepareUserDetails({
          idDetails: { id: KYCDetails?.idDetails?.id, ...data },
        })

        await updateKYCDetails({
          variables: {
            input,
          },
        })
        jumpTo(3)
      } catch (err) {
        if (err instanceof Error) {
          crashlytics().recordError(err)
        }
      } finally {
        setLoading(false)
      }
    },
    [KYCDetails, updateKYCDetails],
  )

  const allowed = useMemo(
    () => Boolean(values.email && values.phoneNumber && values.gender),
    [values.email, values.phoneNumber, values.gender],
  )

  return {
    state: { control, loading, allowed },
    actions: {
      onConfirm,
      handleSubmit,
    },
  }
}

export default useUserDetails
