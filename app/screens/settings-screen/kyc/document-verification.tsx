import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Image, TouchableOpacity, View } from "react-native"
import Stepper from "./stepper"
import { Text, Divider } from "@rneui/themed"
import Icon from "react-native-vector-icons/AntDesign"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import ActionSheet from "@alessiocancian/react-native-actionsheet"
import { IDType } from "./types"
import { Route } from "./hooks/useKYCState"
import useDocumentVerification from "./hooks/useDocumentVerification"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"

const DocumentUpload = ({ LL, styles, onPress, file, icon, loading }) => {
  return (
    <TouchableOpacity style={styles.pickerContainer} onPress={onPress}>
      {Boolean(file) ? (
        <Image source={{ uri: file }} style={{ width: "100%", height: 200 }} />
      ) : (
        <>
          <MaterialIcon name={icon} size={50} />
          <Text type={"p1"}>{LL.KYCScreen.uploadIDFront()}</Text>
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
          LL={LL}
          loading={state.uploadingFrontDoc}
          file={state.idFront}
          icon="card-account-details-outline"
          onPress={() => {
            actions?.setUploadingFront(true)
            actions?.handlePreviewPress()
          }}
          styles={styles}
        />
        {route?.state?.idDetails.type === IDType.DriverLicense ? (
          <DocumentUpload
            LL={LL}
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
        pervious
        nextPage={"user"}
        disableNext={
          Boolean(!state.idFront) || state.uploadingFrontDoc || state.uploadingBackDoc
        }
        perviousPage={"docType"}
      />
      <ActionSheet
        ref={state?.actionSheetRef}
        title={LL.KYCScreen.uploadID()}
        options={["Camera", "Gallery", "Cancel"]}
        cancelButtonIndex={2}
        onPress={actions?.onMenuPress}
      />
    </>
  )
}

export default DocumentVerification
