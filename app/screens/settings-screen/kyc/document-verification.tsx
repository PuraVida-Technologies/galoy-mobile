import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Image, TouchableOpacity, View } from "react-native"
import Stepper from "./stepper"
import { Text, Divider } from "@rneui/themed"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import ActionSheet from "@alessiocancian/react-native-actionsheet"
import { IDType } from "./types"
import { Route } from "./hooks/useKYCState"
import useDocumentVerification from "./hooks/useDocumentVerification"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"

interface Props {
  label: string
  styles: any
  onPress: () => void
  file: string | null
  icon: string
  loading: boolean
}

const DocumentUpload = ({ label, styles, onPress, file, icon, loading }: Props) => {
  return (
    <TouchableOpacity style={styles.pickerContainer} onPress={onPress}>
      {file ? (
        <Image source={{ uri: file }} style={{ width: "100%", height: 200 }} />
      ) : (
        <>
          <MaterialIcon name={icon} size={50} />
          <Text type={"p1"}>{label}</Text>
        </>
      )}
      {loading ? <LoadingComponent isLoading={loading} /> : <></>}
    </TouchableOpacity>
  )
}

const DocumentVerification = ({ jumpTo, route }: Route) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { state, actions } = useDocumentVerification({
    state: route.state,
    setState: route.setState,
  })

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.documentVerification()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <DocumentUpload
          label={LL.KYCScreen.uploadIDFront()}
          loading={state.uploadingFrontDoc}
          file={state.idFront}
          icon="card-account-details-outline"
          onPress={() => {
            actions?.setUploadingFront(true)
            actions?.handlePreviewPress()
          }}
          styles={styles}
        />
        {route?.state?.idDetails?.type === IDType.DriverLicense ? (
          <DocumentUpload
            label={LL.KYCScreen.uploadIDBack()}
            loading={state.uploadingBackDoc}
            file={state.idBack}
            icon="card-bulleted-outline"
            onPress={() => {
              actions?.setUploadingBack(true)
              actions?.handlePreviewPress()
            }}
            styles={styles}
          />
        ) : (
          <></>
        )}
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext={Boolean(state.idFront)}
        previous
        nextPage={"user"}
        disableNext={
          Boolean(!state.idFront) ||
          (route?.state?.idDetails?.type === IDType.DriverLicense && !state.idBack) ||
          state.uploadingFrontDoc ||
          state.uploadingBackDoc
        }
        loading={state.uploadingFrontDoc || state.uploadingBackDoc}
        previousPage={"docType"}
      />
      <ActionSheet
        ref={state.actionSheetRef}
        title={LL.KYCScreen.uploadID()}
        options={["Camera", "Gallery", "Cancel"]}
        cancelButtonIndex={2}
        onPress={actions?.onMenuPress}
      />
    </>
  )
}

export default DocumentVerification
