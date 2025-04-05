import { useCallback, useEffect } from "react"
import useKYCState from "./kyc/hooks/useKYCState"
import { TabBar, TabView } from "react-native-tab-view"
import { SafeAreaView, TouchableOpacity } from "react-native"
import useStyles from "./kyc/styles"
import { Screen } from "@app/components/screen"
import { useNavigation } from "@react-navigation/native"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Icon, Text } from "@rneui/themed"

const KYCScreen = () => {
  const { state, actions } = useKYCState()
  const { state: formState, index, routes, layout } = state
  const { renderScene, setIndex, onBack } = actions
  const styles = useStyles()
  const { LL } = useI18nContext()

  const renderTabBar = useCallback((props) => {
    return (
      <TabBar {...props} style={{ display: "none" }} tabStyle={{ display: "none" }} />
    )
  }, [])

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={onBack}
        >
          <Icon name="chevron-left" type="feather" size={34} />
          <Text type="p1">{LL.common.back()}</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, index])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen
        preset="scroll"
        style={styles.screenStyle}
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          swipeEnabled={false}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </Screen>
    </SafeAreaView>
  )
}

export default KYCScreen
