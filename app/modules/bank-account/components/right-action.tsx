import { TranslationFunctions } from "@app/i18n/i18n-types"
import { makeStyles } from "@rneui/themed"
import { Text, TouchableOpacity } from "react-native"
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated"

interface Props {
  progress: SharedValue<number>
  LL: TranslationFunctions
  onPress: () => void
}

const RightAction = ({ progress, LL, onPress }: Props) => {
  const styles = useStyles()
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value + 90 }],
    }
  })
  return (
    <>
      <Reanimated.View style={styleAnimation}>
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
