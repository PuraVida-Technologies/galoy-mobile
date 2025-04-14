import { useEffect } from "react"
import useKYCState from "./kyc/hooks/useKYCState"

import DocumentType from "./kyc/document-type"
import DocumentProof from "./kyc/document-verification"
import UserDetails from "./kyc/user-details"
import ConfirmDisclosures from "./kyc/confirm-disclosures"
import { SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import useStyles from "./kyc/styles"
import { Screen } from "@app/components/screen"
import { useNavigation } from "@react-navigation/native"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Icon, Text } from "@rneui/themed"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { palette } from "@app/theme/palette"

const KYCScreen = () => {
  const { state, actions } = useKYCState()
  const { jumpTo, onBack } = actions
  const styles = useStyles()
  const { LL } = useI18nContext()

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.headerLeft} onPress={onBack}>
          <Icon name="chevron-left" type="feather" size={34} />
          <Text type="p1">{LL.common.back()}</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, state.index])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen
        preset="scroll"
        style={styles.screenStyle}
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        <LoadingComponent
          isLoading={state.loading}
          color={palette.coolGrey}
          styles={styles.loadingContainer}
        />
        <ScrollView
          scrollEnabled={false}
          ref={state.scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          <DocumentType
            key={"docType"}
            title={"Document Type"}
            setKYCDetails={actions.setKYCDetails}
            KYCDetails={state.KYCDetails}
            jumpTo={jumpTo}
            isStepOneAndTwoCompleted={state.isStepOneAndTwoCompleted}
          />
          <DocumentProof
            key={"docProof"}
            title={"Document Proof"}
            setKYCDetails={actions.setKYCDetails}
            KYCDetails={state.KYCDetails}
            jumpTo={jumpTo}
            isStepOneAndTwoCompleted={state.isStepOneAndTwoCompleted}
          />
          <UserDetails
            key={"user"}
            title={"User"}
            setKYCDetails={actions.setKYCDetails}
            KYCDetails={state.KYCDetails}
            jumpTo={jumpTo}
            isStepOneAndTwoCompleted={state.isStepOneAndTwoCompleted}
          />
          <ConfirmDisclosures
            key={"confirm"}
            title={"Confirm Disclosures"}
            setKYCDetails={actions.setKYCDetails}
            KYCDetails={state.KYCDetails}
            jumpTo={jumpTo}
            isStepOneAndTwoCompleted={state.isStepOneAndTwoCompleted}
          />
        </ScrollView>
      </Screen>
    </SafeAreaView>
  )
}

export default KYCScreen
