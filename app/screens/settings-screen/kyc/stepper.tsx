import { testProps } from "@app/utils/testProps"
import { View } from "react-native"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useCallback } from "react"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"

interface Props {
  jumpTo: (x: string) => void
  nextPage?: string
  nextTitle?: string
  previousTitle?: string
  previousPage?: string
  previous?: boolean
  next?: boolean
  allowNext?: boolean
  disableNext?: boolean
  loading?: boolean
  onNext?: () => void
  onPrevious?: () => void
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
  onNext,
  onPrevious,
}: Props) => {
  const styles = useStyles()
  const { LL } = useI18nContext()

  const onPreviousPage = useCallback(() => {
    if (previousPage) {
      jumpTo(previousPage as string)
    }
    onPrevious?.()
  }, [previousPage])

  const onNextPage = useCallback(() => {
    if (nextPage && allowNext) {
      jumpTo(nextPage as string)
    }
    onNext?.()
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
