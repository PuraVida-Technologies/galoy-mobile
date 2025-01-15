import { openCamera, openPicker } from "react-native-image-crop-picker"
import usePermission from "./usePermission"
import { Platform } from "react-native"
import { RESULTS, PERMISSIONS } from "react-native-permissions"
import { useEffect, useRef, useState } from "react"
import axios from "@app/services/axios"
import { IDType } from "../types"

const useDocumentVerification = ({ state, setState }) => {
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const [idFront, setIdFront] = useState(null)
  const [idBack, setIdBack] = useState(null)
  const actionSheetRef = useRef()

  const uploadingFrontRef = useRef(false)
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

  const cropOption = {
    compressVideoPreset: "Passthrough",
    compressImageMaxWidth: 1000,
    compressImageMaxHeight: 1000,
    compressImageQuality: 0.7,
  }

  const uploadDocument = async (image, url) => {
    try {
      const formData = new FormData()
      formData.append("file", {
        name: image.filename,
        type: image.type,
        uri: image.sourceURL,
      })
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return res
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleCropImageResponse = async (response) => {
    try {
      if (uploadingFrontRef.current) {
        setIdFront(response.path)
        setUploadingFront(true)
        if (response.path) {
          const res = await uploadDocument(
            response,
            `identification/upload?documentType=${state.IDType}`,
          )
          setUploadingFront(false)
          uploadingFrontRef.current = false
          kycId.current = res.data.id
          setState({
            idDetails: { ...res.data, front: response.path },
          })
        }
      } else if (uploadingBackRef.current && state.IDType === IDType.DriverLicense) {
        setIdBack(response.path)
        setUploadingBack(true)
        if (response.path) {
          await uploadDocument(
            response,
            `identification/upload?documentType=${state.IDType}&kycId=${kycId.current}`,
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
        // if ([RESULTS.LIMITED, RESULTS.GRANTED].includes(res)) {
        selectImage()
        // }
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
