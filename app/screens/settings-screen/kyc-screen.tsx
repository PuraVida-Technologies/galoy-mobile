import { useCallback } from "react"
import useKYCState from "./kyc/hooks/useKYCState"
import { TabBar, TabView } from "react-native-tab-view"
import { SafeAreaView } from "react-native"
import useStyles from "./kyc/styles"
import { Screen } from "@app/components/screen"

const KYCScreen = () => {
  const { state, actions } = useKYCState()
  const { state: formState, index, routes, layout } = state
  const { renderScene, setIndex } = actions
  const styles = useStyles()
console.log(formState);
  const renderTabBar = useCallback((props) => {
    return (
      <TabBar {...props} style={{ display: "none" }} tabStyle={{ display: "none" }} />
    )
  }, [])

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
