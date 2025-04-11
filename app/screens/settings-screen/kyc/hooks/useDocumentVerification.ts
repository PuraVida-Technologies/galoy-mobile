import { Image, openCamera, openPicker, Options } from "react-native-image-crop-picker"
import usePermission from "./usePermission"
import { Platform } from "react-native"
import { RESULTS, PERMISSIONS } from "react-native-permissions"
import { useEffect, useRef, useState } from "react"
import axios from "@app/services/axios"
import { prepareIdDetails } from "./utils"
import { UseKYCStateReturnType } from "./useKYCState"
import { toastShow } from "@app/utils/toast"
import ActionSheet from "@alessiocancian/react-native-actionsheet"
import { DocumentUploadResponse, IDType } from "../types"

interface Props {
  state: UseKYCStateReturnType["state"]["state"]
  setState: UseKYCStateReturnType["actions"]["setState"]
}

const useDocumentVerification = ({ state, setState }: Props) => {
  const [uploadingFront, setUploadingFrontState] = useState(false)
  const [uploadingBack, setUploadingBackState] = useState(false)
  const [idFront, setIdFront] = useState<string | null>(null)
  const [idBack, setIdBack] = useState<string | null>(null)
  const actionSheetRef = useRef<ActionSheet>(null)

  const uploadingFrontRef = useRef(false)
  const uploadingBackRef = useRef(false)
  const kycId = useRef<string | null>(null)

  useEffect(() => {
    console.log("Setting state in useEffect: ", state)
    if (state?.idDetails?.front) {
      setIdFront(state.idDetails.front)
    }
    if (state?.idDetails?.back) {
      setIdBack(state.idDetails.back)
    }
  }, [state])

  const setUploadingFront = (value: boolean) => {
    uploadingFrontRef.current = value
    setUploadingFrontState(value)
  }

  const setUploadingBack = (value: boolean) => {
    uploadingBackRef.current = value
    setUploadingBackState(value)
  }

  const { checkPermission } = usePermission({
    shouldRequestPermissionOnLoad: false,
  })

  const cropOption: Options = {
    width: 1000,
    height: 1000,
    cropping: true,
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
        name: image.filename || "photo.jpg",
        type: image.mime || "image/jpeg",
        uri: image.path,
      })
      console.log("FormData:", formData)
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Document uploaded successfully:", res.data)
      return res
    } catch (error) {
      console.error("Error uploading document:", error)
      throw new Error("Error uploading document")
    }
  }

  const handleCropImageResponse = async (response: Image) => {
    console.log("uploadingFront:", uploadingFrontRef.current)
    console.log("uploadingBack:", uploadingBackRef.current)
    try {
      if (uploadingFrontRef.current) {
        console.log("Uploading ID Front...")
        setIdFront(response.path)
        setUploadingFront(true)
        if (response.path) {
          const res: DocumentUploadResponse = await uploadDocument(
            response,
            `identification/upload?documentType=${state?.idDetails?.type === IDType.Other ? state?.IDType : state?.idDetails?.type}`,
          )
          setUploadingFront(false)
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
      } else if (uploadingBackRef.current) {
        console.log("Uploading ID Back...")
        setIdBack(response.path)
        setUploadingBack(true)
        if (response.path) {
          await uploadDocument(
            response,
            `identification/upload?documentType=${state?.idDetails?.type === IDType.Other ? state?.IDType : state?.idDetails?.type}&kycId=${kycId.current}`,
          )
          setUploadingBack(false)
          setState({ idDetails: { ...state.idDetails, back: response.path } })
        }
      }
    } catch (error) {
      console.error("Error handling cropped image response:", error)
      toastShow({
        message: `Error uploading document ${
          uploadingFrontRef.current ? "front" : "back"
        }. Please try again.`,
        type: "error",
      })
      if (uploadingFrontRef.current) {
        setIdFront("")
        setUploadingFront(false)
      }
      if (uploadingBackRef.current) {
        setIdBack("")
        setUploadingBack(false)
      }
    }
  }

  const selectImage = async () => {
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
        if (uploadingFrontRef.current) {
          setUploadingFront(false)
        }
        if (uploadingBackRef.current) {
          setUploadingBack(false)
        }
      })
  }

  const captureImage = async () => {
    openCamera(cropOption)
      .then(async (response) => {
        await handleCropImageResponse(response)
      })
      .catch((error) => {
        console.error("Error opening camera:", error)
      })
      .finally(() => {
        if (uploadingFrontRef.current) {
          setUploadingFront(false)
        }
        if (uploadingBackRef.current) {
          setUploadingBack(false)
        }
      })
  }

  const handlePress = async (type: string) => {
    if (type === "capture") {
      const permission =
        Platform.OS === "android" ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
      checkPermission(permission).then(async (res) => {
        if (res === RESULTS.GRANTED) {
          await captureImage()
        }
      })
    } else if (type === "library") {
      const permission =
        Platform.OS === "android"
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY
      checkPermission(permission).then((res) => {
        if (res === RESULTS.GRANTED) {
          selectImage()
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
      uploadingFront,
      uploadingBack,
    },
    actions: {
      onMenuPress,
      handlePreviewPress,
      setUploadingFront,
      setUploadingBack,
    },
  }
}

export default useDocumentVerification
