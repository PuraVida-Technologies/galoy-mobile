import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { TouchableOpacity, View } from "react-native"
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
  const { state, actions } = useDocumentVerification()

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.documentVerification()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={actions?.handlePreviewPress}
        >
          <Icon name="idcard" size={50} />
          <Text type={"p1"}>{LL.KYCScreen.uploadIDFront()}</Text>
        </TouchableOpacity>
        {route?.state?.IDType === IDType.DriverLicense ? (
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={actions?.handlePreviewPress}
          >
            <MaterialIcon name="card-bulleted-outline" size={50} />
            <Text type={"p1"}>{LL.KYCScreen.uploadIDBack()}</Text>
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
