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
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => {
            actions?.setUploadingFront(true)
            actions?.handlePreviewPress()
          }}
        >
          {Boolean(state.idFront) ? (
            <>
              <Icon name="idcard" size={50} />
              <Text type={"p1"}>{LL.KYCScreen.uploadIDFront()}</Text>
            </>
          ) : (
            <Image
              source={{ uri: state.idFront }}
              style={{ width: "100%", height: 200 }}
            />
          )}
        </TouchableOpacity>
        {route?.state?.IDType === IDType.DriverLicense ? (
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => {
              actions?.setUploadingBack(true)
              actions?.handlePreviewPress()
            }}
          >
            {Boolean(state.idBack) ? (
              <>
                <MaterialIcon name="card-bulleted-outline" size={50} />
                <Text type={"p1"}>{LL.KYCScreen.uploadIDBack()}</Text>
              </>
            ) : (
              <Image
                source={{ uri: state.idBack }}
                style={{ width: "100%", height: 200 }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext
        pervious
        nextPage={"user"}
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
