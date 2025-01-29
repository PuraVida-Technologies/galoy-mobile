import { testProps } from "@app/utils/testProps"
import { View } from "react-native"
import useStyles from "./styles"
import { Button } from "@rneui/themed"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useCallback } from "react"

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
  onNext?: () => void
  onprevious?: () => void
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
  onNext,
  onprevious,
}: Props) => {
  const styles = useStyles()
  const { LL } = useI18nContext()

  const onpreviousPage = useCallback(() => {
    if (previousPage) {
      jumpTo(previousPage as string)
    }
    onprevious?.()
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
        <Button
          {...testProps(LL.common.previous())}
          title={previousTitle || LL.common.previous()}
          buttonStyle={[styles.buttonStyle, styles.previousStyle]}
          containerStyle={styles.buttonContainerStyle}
          titleProps={{ style: [styles.buttonText, styles.buttonInActiveText] }}
          onPress={onpreviousPage}
        />
      ) : (
        <></>
      )}
      {next ? (
        <Button
          {...testProps(LL.common.next())}
          title={nextTitle || LL.common.next()}
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={[styles.buttonStyle, disableNext ? styles.disabled : {}]}
          titleProps={{ style: [styles.buttonText, disableNext ? styles.disabled : {}] }}
          onPress={onNextPage}
          disabled={disableNext}
        />
      ) : (
        <></>
      )}
    </View>
  )
}

export default Stepper
