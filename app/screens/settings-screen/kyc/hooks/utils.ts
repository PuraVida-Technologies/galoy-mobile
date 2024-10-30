import { TranslationFunctions } from "@app/i18n/i18n-types"
import { PERMISSIONS, Permission } from "react-native-permissions"

export const getPermissionMessage = (
  permission: Permission,
  LL: TranslationFunctions,
) => {
  switch (permission) {
    case PERMISSIONS.ANDROID.CAMERA:
    case PERMISSIONS.IOS.CAMERA:
      return {
        title: LL.common.confirmationDialog.cameraPermissionTitle(),
        message: LL.common.confirmationDialog.cameraPermission(),
      }

    case PERMISSIONS.IOS.PHOTO_LIBRARY:
      return {
        title: LL.common.confirmationDialog.mediaPermissionTitle(),
        message: LL.common.confirmationDialog.mediaPermission(),
      }

    default:
      return {
        title: LL.common.confirmationDialog.cameraPermissionTitle(),
        message: LL.common.confirmationDialog.cameraPermission(),
      }
  }
}
