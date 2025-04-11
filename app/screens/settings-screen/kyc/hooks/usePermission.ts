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
import { PermissionStatus } from "../types"

interface Props {
  redirectTo?: string
  shouldRedirect?: boolean
  checkPermissionOnLoad?: boolean
  shouldRequestPermissionOnLoad?: boolean
  permission?: Permission
  onDecline?: () => void
}

const OldAlert = Alert.alert

Alert.alert = (...args) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      OldAlert(...args)
    })
  })
}

const usePermission = ({ onDecline, shouldRequestPermissionOnLoad }: Props) => {
  const { LL } = useI18nContext()

  const device =
    Platform.OS === "android" ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA

  useEffect(() => {
    if (shouldRequestPermissionOnLoad) {
      checkPermission()
    }
  }, [onDecline, shouldRequestPermissionOnLoad])

  const handelRedirection = useCallback(() => {
    onDecline?.()
  }, [onDecline])

  const handelPermissionInfo = useCallback(
    (permission: Permission) => {
      const message = getPermissionMessage(permission, LL)

      Alert.alert(message?.title, message?.message, [
        {
          text: "Open Settings",
          onPress: () => {
            handelRedirection()
            Linking.openSettings()
          },
        },
        {
          text: "Cancel",
          onPress: () => handelRedirection(),
          style: "cancel",
        },
      ])
    },
    [handelRedirection],
  )

  const requestPermission = useCallback(
    async (device: Permission) => {
      const res = await request(device)
      if (res === RESULTS.BLOCKED) {
        handelPermissionInfo(device)
      }
      return res === RESULTS.GRANTED
        ? PermissionStatus.GRANTED
        : res === RESULTS.LIMITED
          ? PermissionStatus.LIMITED
          : res === RESULTS.DENIED
            ? PermissionStatus.DENIED
            : null
    },
    [handelPermissionInfo],
  )

  const checkPermission = useCallback(
    async (permission?: Permission): Promise<PermissionStatus | null> => {
      try {
        const result = await check(permission || device)
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert(
              "Permission Unavailable",
              "This permission is not available on your device.",
            )
            return PermissionStatus.UNAVAILABLE
          case RESULTS.DENIED:
            return await requestPermission(permission || device)
          case RESULTS.LIMITED:
            return PermissionStatus.LIMITED
          case RESULTS.GRANTED:
            return PermissionStatus.GRANTED
          case RESULTS.BLOCKED:
            handelPermissionInfo(permission || device)
            return PermissionStatus.BLOCKED
        }
      } catch (error) {
        console.log("Permission check error:", error)
        Alert.alert(
          "Permission Error",
          "An unexpected error occurred while checking permissions. Please try again.",
        )
        return null
      }
    },
    [requestPermission, handelPermissionInfo],
  )

  return {
    checkPermission,
    requestPermission,
  }
}

export type UseCameraPermissionReturnType = ReturnType<typeof usePermission>

export default usePermission
