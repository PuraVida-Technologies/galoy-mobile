import { Image, openCamera, openPicker, Options } from "react-native-image-crop-picker"
import usePermission from "./usePermission"
import { Platform } from "react-native"
import { PERMISSIONS } from "react-native-permissions"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "@app/services/axios"
import { prepareIdDetails } from "./utils"
import { UseKYCStateReturnType } from "./useKYCState"
import { toastShow } from "@app/utils/toast"
import ActionSheet from "@alessiocancian/react-native-actionsheet"
import { IDType, PermissionStatus } from "../types"
import { TranslationFunctions } from "@app/i18n/i18n-types"

export enum UploadingId {
  UploadingFront = "uploading-front",
  UploadingBack = "uploading-back",
}
interface Props {
  KYCDetails: UseKYCStateReturnType["state"]["KYCDetails"]
  setKYCDetails: UseKYCStateReturnType["actions"]["setKYCDetails"]
  LL: TranslationFunctions
}

const useDocumentVerification = ({ KYCDetails, setKYCDetails, LL }: Props) => {
  const [idFront, setIdFront] = useState<string | null>(null)
  const [idBack, setIdBack] = useState<string | null>(null)
  const actionSheetRef = useRef<ActionSheet>(null)
  const uploadingUrlRef = useRef<string>("")
  const [uploadingId, setUploadingId] = useState<UploadingId>(UploadingId.UploadingFront)
  const [uploading, setUploading] = useState(false)
  const kycId = useRef<string | null>(null)
  const options = [
    { label: "Camera", onPress: () => handlePress("capture") },
    { label: "Gallery", onPress: () => handlePress("library") },
    {
      label: "Cancel",
      onPress: () => {
        setUploading(false)
      },
      type: "cancel",
    },
  ]

  const cropOption: Options = useMemo(
    () => ({
      width: 1000,
      height: 1000,
      cropping: true,
      compressVideoPreset: "Passthrough",
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 0.7,
    }),
    [],
  )

  const isUploadingFront = useMemo(
    () => uploadingId === UploadingId.UploadingFront,
    [uploadingId],
  )
  const isUploadingBack = useMemo(
    () => uploadingId === UploadingId.UploadingBack,
    [uploadingId],
  )

  useEffect(() => {
    let url = `identification/upload?documentType=${KYCDetails?.idDetails?.type === IDType.Other ? KYCDetails?.IDType : KYCDetails?.idDetails?.type}`
    if (isUploadingBack) {
      url = `${url}&kycId=${kycId.current}`
    }
    uploadingUrlRef.current = url
  }, [isUploadingBack, KYCDetails?.idDetails?.type, KYCDetails?.IDType])

  useEffect(() => {
    if (KYCDetails?.idDetails?.front) {
      setIdFront(KYCDetails.idDetails.front)
    }
    if (KYCDetails?.idDetails?.back) {
      setIdBack(KYCDetails.idDetails.back)
    }
  }, [KYCDetails])

  const { checkPermission } = usePermission({
    shouldRequestPermissionOnLoad: false,
  })

  const uploadDocument = useCallback(
    async (image: Image) => {
      try {
        const formData = new FormData()
        formData.append("file", {
          name: image.filename || "photo.jpg",
          type: image.mime || "image/jpeg",
          uri: image.path,
        })
        const res = await axios.post(uploadingUrlRef.current, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        kycId.current = res?.data?.id
        const idDetails = prepareIdDetails({
          ...KYCDetails?.idDetails,
          ...res?.data,
          type: KYCDetails?.idDetails?.type,
        })
        if (actionSheetRef.current?.props.id === UploadingId.UploadingFront) {
          idDetails.front = image.path
        } else if (actionSheetRef.current?.props.id === UploadingId.UploadingBack) {
          idDetails.back = image.path
        }
        setKYCDetails({
          idDetails,
        })
        return res
      } catch (error) {
        console.error("Error uploading document:", error)
        throw new Error("Error uploading document")
      }
    },
    [setKYCDetails, KYCDetails?.idDetails?.type],
  )

  const handleCropImageResponse = useCallback(
    async (response: Image) => {
      try {
        if (actionSheetRef.current?.props.id === UploadingId.UploadingFront) {
          setIdFront(response.path)
          if (response.path) {
            await uploadDocument(response)
          }
        } else if (actionSheetRef.current?.props.id === UploadingId.UploadingBack) {
          setIdBack(response.path)
          if (response.path) {
            await uploadDocument(response)
          }
        }
      } catch (error) {
        console.error("Error handling cropped image response:", error)
        toastShow({
          message: LL.KYCScreen.uploadingIdError({
            uploadingId:
              actionSheetRef.current?.props.id === UploadingId.UploadingFront
                ? "front"
                : "back",
          }),
          LL,
          type: "error",
        })
        setUploading(false)
        if (actionSheetRef.current?.props.id === UploadingId.UploadingFront) {
          setIdFront("")
        }
        if (actionSheetRef.current?.props.id === UploadingId.UploadingBack) {
          setIdBack("")
        }
      }
    },
    [LL, uploadDocument],
  )

  const selectImage = useCallback(async () => {
    const pickerOptions: Options = {
      ...cropOption,
      mediaType: "photo",
    }

    openPicker(pickerOptions)
      .then((res) => handleCropImageResponse(res))
      .catch((error) => {
        console.error("Error selecting image:", error)
      })
      .finally(() => {
        setUploading(false)
      })
  }, [handleCropImageResponse, cropOption])

  const captureImage = useCallback(async () => {
    openCamera(cropOption)
      .then(async (response) => {
        await handleCropImageResponse(response)
      })
      .catch((error) => {
        console.error("Error opening camera:", error)
      })
      .finally(() => {
        setUploading(false)
      })
  }, [handleCropImageResponse, cropOption])

  const handlePress = useCallback(
    async (type: string) => {
      setUploading(true)
      if (type === "capture") {
        const permission =
          Platform.OS === "android" ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
        checkPermission(permission).then(async (res) => {
          if ([PermissionStatus.GRANTED, PermissionStatus.LIMITED].includes(res!)) {
            await captureImage()
          }
        })
      } else if (type === "library") {
        const permission =
          Platform.OS === "android"
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.IOS.PHOTO_LIBRARY
        checkPermission(permission).then((res) => {
          if ([PermissionStatus.GRANTED, PermissionStatus.LIMITED].includes(res!)) {
            selectImage()
          }
        })
      }
    },
    [captureImage, checkPermission, selectImage],
  )

  const onMenuPress = (index: number) => {
    const currentOption = options.find((o, i) => i === index)
    currentOption?.onPress?.()
  }

  const handlePreviewPress = () => {
    actionSheetRef?.current?.show?.()
  }

  return {
    state: {
      actionSheetRef,
      idFront,
      idBack,
      uploadingId,
      uploading,
      isUploadingFront,
      isUploadingBack,
    },
    actions: {
      onMenuPress,
      handlePreviewPress,
      setUploadingId,
    },
  }
}

export default useDocumentVerification
