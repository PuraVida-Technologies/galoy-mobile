import { testProps } from "@app/utils/testProps"
import { Keyboard, Platform, View } from "react-native"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useCallback } from "react"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { useNavigation } from "@react-navigation/native"

interface Props {
  jumpTo: (x: number) => void
  nextPage?: number
  nextTitle?: string
  previousTitle?: string
  previousPage?: number
  previous?: boolean
  next?: boolean
  allowNext?: boolean
  disableNext?: boolean
  isStepOneAndTwoCompleted?: boolean
  loading?: boolean
  onNext?: () => void
  onPrevious?: () => void
}

export const dismissKeyboard = async (): Promise<void> => {
  if (!Keyboard.isVisible()) return
  return new Promise((resolve) => {
    if (Platform.OS === "ios") {
      const keyboardShowListener = Keyboard.addListener("keyboardDidHide", () => {
        resolve()
        keyboardShowListener.remove()
      })
    } else {
      resolve()
    }
    Keyboard.dismiss()
  })
}

const Stepper = ({
  allowNext,
  jumpTo,
  nextTitle,
  previousTitle,
  nextPage,
  previousPage,
  previous,
  next = true,
  disableNext,
  loading,
  isStepOneAndTwoCompleted,
  onNext,
  onPrevious,
}: Props) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const navigation = useNavigation()

  const onPreviousPage = useCallback(async () => {
    try {
      await dismissKeyboard() // Dismiss keyboard before navigating to avoid layout issues
      if (previousPage === 0 || previousPage) {
        jumpTo?.(previousPage as number)
      }
      onPrevious?.()
    } catch (error) {
      console.error("Error in onPreviousPage", error)
    }
  }, [previousPage, isStepOneAndTwoCompleted])

  const onNextPage = useCallback(async () => {
    try {
      await dismissKeyboard() // Dismiss keyboard before navigating to avoid layout issues
      if (nextPage && allowNext) {
        jumpTo(nextPage as number)
      }
      onNext?.()
    } catch (error) {
      console.error("Error in onNextPage", error)
    }
  }, [nextPage, allowNext])

  return (
    <View style={styles.flexContainer}>
      {previous ? (
        <GaloyPrimaryButton
          {...testProps(LL.common.previous())}
          title={previousTitle || LL.common.previous()}
          buttonStyle={[styles.buttonStyle, styles.previousStyle]}
          disabledStyle={[styles.buttonStyle, styles.disabled]}
          containerStyle={[styles.buttonContainerStyle, styles.perviousButtonContainer]}
          titleStyle={styles.buttonInActiveText}
          disabledTitleStyle={[styles.buttonInActiveText, styles.disabled]}
          onPress={onPreviousPage}
          disabled={loading}
        />
      ) : (
        <></>
      )}
      {next ? (
        <GaloyPrimaryButton
          {...testProps(LL.common.next())}
          title={nextTitle || LL.common.next()}
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={[styles.buttonStyle, disableNext ? styles.disabled : {}]}
          disabled={disableNext || !allowNext}
          onPress={onNextPage}
          loading={loading}
        />
      ) : (
        <></>
      )}
    </View>
  )
}

export default Stepper
