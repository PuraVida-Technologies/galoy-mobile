import { openCamera, openPicker } from "react-native-image-crop-picker"
import usePermission from "./usePermission"
import { Platform } from "react-native"
import { RESULTS, PERMISSIONS } from "react-native-permissions"
import { useRef } from "react"

const useDocumentVerification = () => {
  const actionSheetRef = useRef()

  const { checkPermission } = usePermission({
    shouldRequestPermissionOnLoad: false,
  })

  const cropOption = {
    compressVideoPreset: "Passthrough",
    compressImageMaxWidth: 1000,
    compressImageMaxHeight: 1000,
    compressImageQuality: 0.7,
  }

  const handleCropImageResponse = (response) => {
    console.log("response", response)
  }

  const selectImage = async () => {
    const pickerOptions = {
      mediaType: "photo",
      mimeTypes: ["image/jpeg", "image/png"],
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
        console.log(error)
      })
  }

  const handlePress = (type) => {
    if (type === "capture") {
      checkPermission().then((res) => {
        if (res === RESULTS.GRANTED) {
          captureImage()
        }
      })
    } else if (Platform.OS === "android") {
      selectImage()
    } else {
      const permission = PERMISSIONS.IOS.PHOTO_LIBRARY
      checkPermission(permission).then((res) => {
        console.log("res ===>", res)
        if ([RESULTS.LIMITED, RESULTS.GRANTED].includes(res)) {
          selectImage()
        }
      })
    }
  }

  const options = [
    { label: "Camera", onPress: () => handlePress("capture") },
    { label: "Gallery", onPress: () => handlePress("library") },
    { label: "Cancel", onPress: () => {}, type: "cancel" },
  ]
  const onMenuPress = (index) => {
    const currentOption = options.find((o, i) => i === index)
    console.log("currentOption")
    currentOption?.onPress?.()
  }

  const handlePreviewPress = () => {
    actionSheetRef?.current?.show?.()
  }

  return {
    state: {
      actionSheetRef,
    },
    actions: {
      onMenuPress,
      handlePreviewPress,
    },
  }
}

export default useDocumentVerification
