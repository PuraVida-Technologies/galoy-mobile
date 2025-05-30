import { TranslationFunctions } from "@app/i18n/i18n-types"
import { PERMISSIONS, Permission } from "react-native-permissions"
import { KYCDetails } from "./useKYCState"
import { Document } from "../types"
import { Dimensions } from "react-native"

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

    case PERMISSIONS.ANDROID.READ_MEDIA_IMAGES:
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

export const prepareIdDetails = (
  state: Document & { front?: string | null; back?: string | null; type?: string | null },
) => {
  return {
    address: state?.address,
    citizenships: state?.citizenships,
    email: state?.email,
    front: state?.front,
    back: state?.back,
    fullName: state?.fullName,
    galoyUserId: state?.galoyUserId,
    gender: state?.gender,
    id: state?.id,
    isHighRisk: state?.isHighRisk ? "yes" : "no",
    isPoliticallyExposed: state?.isPoliticallyExposed ? "yes" : "no",
    maritalStatus: state?.maritalStatus,
    phoneNumber: state?.phoneNumber,
    type: state?.type,
  }
}

export const prepareKYCDetails = (state: KYCDetails) => {
  return {
    email: state?.idDetails?.email,
    phoneNumber: state?.idDetails?.phoneNumber,
    id: state?.idDetails?.id || "",
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
export const prepareUserDetails = (state: {
  idDetails: Pick<
    KYCDetails["idDetails"],
    "email" | "phoneNumber" | "gender" | "status" | "id"
  >
}) => {
  return {
    email: state?.idDetails?.email,
    phoneNumber: state?.idDetails?.phoneNumber,
    gender: state?.idDetails?.gender,
    status: state?.idDetails?.status,
    id: state?.idDetails?.id || "",
  }
}

export const stepWidth = Dimensions.get("window").width
