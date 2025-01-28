import { makeStyles } from "@rneui/themed"
import { I18nManager, Text, TouchableOpacity, View } from "react-native"
import Reanimated, { useAnimatedStyle } from "react-native-reanimated"

const RightAction = ({ progress, LL, onPress }) => {
  const styles = useStyles()
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value + 80 }],
    }
  })

  return (
    <>
      {/* <View
        style={{
          backgroundColor: "red",
          flex: 1,
          position: "absolute",
          left: -10,
          width: "100%",
        }}
      /> */}
      <Reanimated.View style={[styleAnimation]}>
        <TouchableOpacity onPress={onPress} style={styles.container}>
          <Text style={styles.removeText}>{LL.common.remove()}</Text>
        </TouchableOpacity>
      </Reanimated.View>
    </>
  )
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.red,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  removeText: {
    color: colors.white,
    fontWeight: "bold",
  },
}))

export default RightAction
