import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import {
  Image,
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  ImageStyle,
} from "react-native"
import Stepper from "./stepper"
import { Text, Divider, useTheme } from "@rneui/themed"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import ActionSheet from "@alessiocancian/react-native-actionsheet"
import { IDType } from "./types"
import { TabProps } from "./hooks/useKYCState"
import useDocumentVerification, { UploadingId } from "./hooks/useDocumentVerification"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { stepWidth } from "./hooks/utils"

interface Props {
  label: string
  styles: TouchableOpacityProps["style"]
  imageStyles: ImageStyle
  onPress: () => void
  file: string | null
  icon: string
  loading: boolean
  disabled?: boolean
}

const DocumentUpload = ({
  label,
  styles,
  imageStyles,
  onPress,
  file,
  icon,
  loading,
  disabled,
}: Props) => {
  const { theme } = useTheme()
  return (
    <TouchableOpacity style={styles} onPress={onPress} disabled={loading || disabled}>
      {file ? (
        <Image source={{ uri: file }} style={imageStyles} />
      ) : (
        <>
          <MaterialIcon
            name={icon}
            size={50}
            color={disabled ? theme.colors.grey3 : theme.colors.text}
          />
          <Text type={"p1"} color={disabled ? theme.colors.grey3 : theme.colors.text}>
            {label}
          </Text>
        </>
      )}
      {loading ? <LoadingComponent isLoading={loading} /> : <></>}
    </TouchableOpacity>
  )
}

const DocumentVerification = ({ jumpTo, KYCDetails, setKYCDetails }: TabProps) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { state, actions } = useDocumentVerification({
    LL,
    KYCDetails,
    setKYCDetails,
  })

  return (
    <View style={{ width: stepWidth }}>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.documentVerification()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <DocumentUpload
          label={LL.KYCScreen.uploadIDFront()}
          loading={state.isUploadingFront && state.uploading}
          file={state.idFront}
          icon="card-account-details-outline"
          onPress={() => {
            actions?.setUploadingId(UploadingId.UploadingFront)
            actions?.handlePreviewPress()
          }}
          styles={styles.pickerContainer}
          imageStyles={styles.image}
        />
        {KYCDetails?.idDetails?.type === IDType.DriverLicense ? (
          <DocumentUpload
            label={LL.KYCScreen.uploadIDBack()}
            loading={state.isUploadingBack && state.uploading}
            file={state.idBack}
            icon="card-bulleted-outline"
            onPress={() => {
              actions?.setUploadingId(UploadingId.UploadingBack)
              actions?.handlePreviewPress()
            }}
            styles={styles.pickerContainer}
            imageStyles={styles.image}
            disabled={
              !state.idFront ||
              state.uploading ||
              (state.isUploadingBack && state.uploading)
            }
          />
        ) : (
          <></>
        )}
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext={Boolean(state.idFront)}
        previous
        nextPage={2}
        disableNext={
          Boolean(!state.idFront) ||
          (KYCDetails?.idDetails?.type === IDType.DriverLicense && !state.idBack) ||
          state.uploading
        }
        loading={state.uploading}
        previousPage={0}
      />
      <ActionSheet
        ref={state.actionSheetRef}
        title={LL.KYCScreen.uploadID()}
        options={["Camera", "Gallery", "Cancel"]}
        cancelButtonIndex={2}
        id={state.uploadingId}
        onPress={actions?.onMenuPress}
      />
    </View>
  )
}

export default DocumentVerification
