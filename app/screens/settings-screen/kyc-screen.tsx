import { useCallback, useEffect } from "react"
import useKYCState, { KYCState } from "./kyc/hooks/useKYCState"
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
  TabView,
} from "react-native-tab-view"
import { SafeAreaView, TouchableOpacity } from "react-native"
import useStyles from "./kyc/styles"
import { Screen } from "@app/components/screen"
import { useNavigation } from "@react-navigation/native"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Icon, Text } from "@rneui/themed"

const KYCScreen = () => {
  const { state, actions } = useKYCState()
  const { index, routes, layout } = state
  const { renderScene, setIndex, onBack } = actions
  const styles = useStyles()
  const { LL } = useI18nContext()

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<{
          key: string
          title: string
          setState: (next: KYCState) => void
          state: KYCState
        }>
      },
    ) => {
      return (
        <TabBar {...props} style={styles.displayNone} tabStyle={styles.displayNone} />
      )
    },
    [],
  )

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
