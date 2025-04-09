import { Image, openCamera, openPicker, Options } from "react-native-image-crop-picker"
import usePermission from "./usePermission"
import { Platform, Alert, Linking } from "react-native"
import { RESULTS, PERMISSIONS } from "react-native-permissions"
import { useEffect, useRef, useState } from "react"
import axios from "@app/services/axios"
import { IDType } from "../types"
import { prepareIdDetails } from "./utils"
import { UseKYCStateReturnType } from "./useKYCState"

interface Props {
  state: UseKYCStateReturnType["state"]["state"]
  setState: UseKYCStateReturnType["actions"]["setState"]
}

const useDocumentVerification = ({ state, setState }: Props) => {
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const [idFront, setIdFront] = useState<string | null>(null)
  const [idBack, setIdBack] = useState<string | null>(null)
  const actionSheetRef = useRef()

  const uploadingFrontRef = useRef<boolean>(false)
  const uploadingBackRef = useRef(false)
  const kycId = useRef(null)

  useEffect(() => {
    if (state?.idDetails?.front) {
      setIdFront(state.idDetails.front)
    }
    if (state?.idDetails?.back) {
      setIdBack(state.idDetails.back)
    }
  }, [state])

  const { checkPermission } = usePermission({
    shouldRequestPermissionOnLoad: false,
  })

  const cropOption: Options = {
    width: 1000,
    height: 1000,
    // cropping: true,
    compressVideoPreset: "Passthrough",
    compressImageMaxWidth: 1000,
    compressImageMaxHeight: 1000,
    compressImageQuality: 0.7,
  }

  const uploadDocument = async (image: Image, url: string) => {
    console.log("Uploading document to URL:", image, url)
    try {
      const formData = new FormData()
      formData.append("file", {
        name: image.filename || "document.jpg",
        type: image.mime,
        uri: image.path,
      })
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return res
    } catch (error) {
      console.log("Error uploading document:", error)
    }
  }

  const handleCropImageResponse = async (response: Image) => {
    try {
      if (uploadingFrontRef.current) {
        setIdFront(response.path)
        setUploadingFront(true)
        if (response.path) {
          const res = await uploadDocument(
            response,
            `identification/upload?documentType=${state?.idDetails?.type}`,
          )
          setUploadingFront(false)
          uploadingFrontRef.current = false
          kycId.current = res?.data?.id
          const idDetails = prepareIdDetails({
            ...res?.data,
            type: state?.idDetails?.type,
            front: response.path,
          })
          setState({
            idDetails,
          })
        }
      } else if (
        uploadingBackRef.current &&
        state &&
        state.idDetails &&
        state.idDetails.type === IDType.DriverLicense
      ) {
        setIdBack(response.path)
        setUploadingBack(true)
        if (response.path) {
          await uploadDocument(
            response,
            `identification/upload?documentType=${state.idDetails.type}&kycId=${kycId.current}`,
          )
          setState({ idDetails: { ...state.idDetails, back: response.path } })
          setUploadingBack(false)
          uploadingBackRef.current = false
        }
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const selectImage = async () => {
    const pickerOptions: Options = {
      mediaType: "photo",
    }

    openPicker(pickerOptions)
      .then((res) => handleCropImageResponse(res))
      .catch((error) => {
        console.log(error)
      })
  }

  const captureImage = async () => {
    openCamera(cropOption)
      .then((response) => {
        handleCropImageResponse(response)
      })
      .catch((error) => {
        console.error("Error opening camera:", error)
      })
  }

  const handlePress = (type: string) => {
    if (type === "capture") {
      const permission =
        Platform.OS === "android" ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
      checkPermission(permission).then((res) => {
        console.log("Camera permission result:", res) // Log the permission result
        if (res === RESULTS.GRANTED) {
          captureImage()
        } else if (res === RESULTS.DENIED) {
          console.log("Permission denied. Requesting permission...")
          checkPermission(permission).then((newRes) => {
            console.log("New camera permission result:", newRes) // Log the new result
            if (newRes === RESULTS.GRANTED) {
              captureImage()
            } else {
              console.log("Camera permission denied after request.")
            }
          })
        } else if (res === RESULTS.BLOCKED) {
          console.log("Permission blocked. Redirecting to settings...")
          Alert.alert(
            "Permission Blocked",
            "Camera permission is blocked. Please enable it in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          )
        } else {
          console.log("Camera permission not granted.")
        }
      })
    } else if (type === "library") {
      const permission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY
      checkPermission(permission).then((res) => {
        if ([RESULTS.LIMITED, RESULTS.GRANTED].includes(res)) {
          selectImage()
        } else if (res === RESULTS.DENIED) {
          // Request permission if denied
          checkPermission(permission).then((newRes) => {
            if ([RESULTS.LIMITED, RESULTS.GRANTED].includes(newRes)) {
              selectImage()
            } else {
              console.log("Gallery permission denied")
            }
          })
        } else {
          console.log("Gallery permission not granted")
        }
      })
    }
  }

  const options = [
    { label: "Camera", onPress: () => handlePress("capture") },
    { label: "Gallery", onPress: () => handlePress("library") },
    {
      label: "Cancel",
      onPress: () => {
        setUploadingFront(false)
        setUploadingBack(false)
      },
      type: "cancel",
    },
  ]
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
      uploadingFront: uploadingFrontRef.current,
      uploadingBack: uploadingBackRef.current,
      uploadingFrontDoc: uploadingFront,
      uploadingBackDoc: uploadingBack,
    },
    actions: {
      onMenuPress,
      handlePreviewPress,
      setUploadingFront: (value: boolean) => (uploadingFrontRef.current = value),
      setUploadingBack: (value: boolean) => (uploadingBackRef.current = value),
    },
  }
}

export default useDocumentVerification
