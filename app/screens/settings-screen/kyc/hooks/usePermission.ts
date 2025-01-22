import { useCallback, useEffect } from "react"
import { Alert, Linking, Platform } from "react-native"
import {
  PERMISSIONS,
  Permission,
  RESULTS,
  check,
  request,
} from "react-native-permissions"
import { getPermissionMessage } from "./utils"
import { useI18nContext } from "@app/i18n/i18n-react"

interface Props {
  cameraState?: any
  redirectTo?: string
  shouldRedirect?: boolean
  checkPermissionOnLoad?: boolean
  shouldRequestPermissionOnLoad?: boolean
  permission?: Permission
  onDecline?: () => void
}

let props: any = {}

const OldAlert = Alert.alert

Alert.alert = (...args) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      OldAlert(...args)
    })
  })
}

const usePermission = ({ onDecline }: Props) => {
  const { LL } = useI18nContext()

  const device =
    Platform.OS === "android" ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
  useEffect(() => {
    // to get updated stale props
    props = { onDecline }
  }, [onDecline])

  const handelRedirection = useCallback(() => {
    props?.onDecline?.()
  }, [props?.onDecline])

  const handelPermissionInfo = useCallback(
    (permission) => {
      const message = getPermissionMessage(permission, LL)

      Alert.alert(message?.title, message?.message, [
        {
          text: "Agree",
          onPress: () => {
            handelRedirection()
            Linking.openSettings()
          },
        },
        {
          text: "Decline",
          onPress: () => handelRedirection(),
          style: "cancel",
        },
      ])
    },
    [handelRedirection],
  )

  const requestPermission = useCallback(
    (device: Permission) => {
      return request(device).then(async (res: any) => {
        if ([RESULTS.BLOCKED, RESULTS.DENIED].includes(res)) {
          handelPermissionInfo(device)
        }
        return res
      })
    },
    [handelPermissionInfo, request],
  )

  const checkPermission = useCallback(
    async (permission?: Permission) => {
      try {
        const result = await check(permission || device)
        switch (result) {
          case RESULTS.UNAVAILABLE:
            return result
          case RESULTS.DENIED:
            if (Platform.OS === "ios") {
              await requestPermission(permission || device)
            } else {
              handelPermissionInfo(permission || device)
            }
            return result
          case RESULTS.LIMITED:
            return result
          case RESULTS.GRANTED:
            return result
          case RESULTS.BLOCKED:
            handelPermissionInfo(permission || device)
            return result
        }
      } catch (error) {
        console.log("error", error)
        return error
      }
    },
    [requestPermission, handelPermissionInfo, check],
  )

  return {
    checkPermission,
    requestPermission,
  }
}

export type UseCameraPermissionReturnType = ReturnType<typeof usePermission>

export default usePermission
