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

export const prepareIdDetails = (state: any) => {
  return {
    address: state?.address,
    citizenships: state?.citizenships,
    email: state?.email,
    front: state?.front,
    fullName: state?.fullName,
    galoyUserId: state?.galoyUserId,
    gender: state?.gender,
    id: state?.id,
    isHighRisk: state?.isHighRisk,
    isPoliticallyExposed: state?.isPoliticallyExposed,
    maritalStatus: state?.maritalStatus,
    phoneNumber: state?.phoneNumber,
    type: state?.type,
  }
}

export const prepareKYCDetails = (state: any) => {
  return {
    email: state?.idDetails?.email || state?.email,
    phoneNumber: state?.idDetails?.phoneNumber || state?.phoneNumber,
    id: state?.idDetails?.id,
    citizenships: state?.idDetails?.citizenships,
    fullName: state?.idDetails?.fullName,
    gender: state?.idDetails?.gender,
    isHighRisk: state?.idDetails?.isHighRisk === "yes",
    isPoliticallyExposed: state?.idDetails?.isPoliticallyExposed === "yes",
    martialStatus: state?.idDetails?.martialStatus,
    placeOfBirth: state?.idDetails?.placeOfBirth,
    status: state?.idDetails?.status,
  }
}
export const prepareUserDetails = (state: any) => {
  return {
    email: state?.idDetails?.email || state?.email,
    phoneNumber: state?.idDetails?.phoneNumber || state?.phoneNumber,
    gender: state?.idDetails?.gender,
    status: state?.idDetails?.status,
    id: state?.idDetails?.id,
  }
}
