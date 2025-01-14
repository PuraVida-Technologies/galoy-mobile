import { openCamera, openPicker } from "react-native-image-crop-picker"
import usePermission from "./usePermission"
import { Platform } from "react-native"
import { RESULTS, PERMISSIONS } from "react-native-permissions"
import { useEffect, useRef, useState } from "react"
import { getStorage } from "@app/modules/market-place/utils/helper"
import { ACCESS_TOKEN } from "@app/modules/market-place/config/constant"
import axios from "@app/services/axios"

const useDocumentVerification = ({ state, setState }) => {
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingFrontDoc, setUploadingFrontDoc] = useState(false)
  const [uploadingBackDoc, setUploadingBackDoc] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const [idFront, setIdFront] = useState(null)
  const [idBack, setIdBack] = useState(null)
  const actionSheetRef = useRef()

  const uploadingFrontRef = useRef(uploadingFront)
  const uploadingBackRef = useRef(uploadingBack)
  const kycId = useRef(null)

  useEffect(() => {
    uploadingFrontRef.current = uploadingFront
  }, [uploadingFront])
  useEffect(() => {
    uploadingBackRef.current = uploadingBack
  }, [uploadingBack])

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

  const handleCropImageResponse = async (response) => {
    try {
      if (uploadingFrontRef.current) {
        setIdFront(response.path)
        setUploadingFrontDoc(true)
        if (response.path) {
          const fdata = new FormData()
          fdata.append("file", {
            name: response.filename,
            type: response.type,
            uri: response.sourceURL,
          })
          const authToken = await getStorage(ACCESS_TOKEN)
          const res = await axios.post(
            `identification/upload?documentType=${state.IDType}`,
            fdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${authToken}`,
              },
            },
          )
          setUploadingFront(false)
          setUploadingFrontDoc(false)
          kycId.current = res.data.id
          setState({
            idDetails: { ...res.data, front: response.path },
            kycId: res.data.id,
          })
        }
      } else if (uploadingBackRef.current) {
        setIdBack(response.path)
        setUploadingBackDoc(true)
        if (response.path) {
          const fdata = new FormData()
          fdata.append("file", {
            name: response.filename,
            type: response.type,
            uri: response.sourceURL,
          })
          const authToken = await getStorage(ACCESS_TOKEN)
          const res = await axios.post(
            `identification/upload?documentType=${state.IDType}&kycId=${kycId.current}`,
            fdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${authToken}`,
              },
            },
          )
          setState({ idDetails: { ...state.idDetails, back: response.path } })
          setUploadingBackDoc(false)
          setUploadingBack(false)
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
  const onMenuPress = (index) => {
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
      uploadingFrontDoc,
      uploadingBackDoc,
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
