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
  perviousTitle?: string
  perviousPage?: string
  pervious?: boolean
  next?: boolean
  allowNext?: boolean
  disableNext?: boolean
  onNext?: () => void
  onPervious?: () => void
}

const Stepper = ({
  allowNext,
  jumpTo,
  nextTitle,
  perviousTitle,
  nextPage,
  perviousPage,
  pervious,
  next = true,
  disableNext,
  onNext,
  onPervious,
}: Props) => {
  const styles = useStyles()
  const { LL } = useI18nContext()

  const onPerviousPage = useCallback(() => {
    if (perviousPage) {
      jumpTo(perviousPage as string)
    }
    onPervious?.()
  }, [perviousPage])

  const onNextPage = useCallback(() => {
    if (nextPage && allowNext) {
      jumpTo(nextPage as string)
    }
    onNext?.()
  }, [nextPage, allowNext])

  return (
    <View style={styles.flexContainer}>
      {pervious ? (
        <Button
          {...testProps(LL.common.pervious())}
          title={perviousTitle || LL.common.pervious()}
          buttonStyle={[styles.buttonStyle, styles.perviousStyle]}
          containerStyle={styles.buttonContainerStyle}
          titleProps={{ style: [styles.buttonText, styles.buttonInActiveText] }}
          onPress={onPerviousPage}
        />
      ) : (
        <></>
      )}
      {next ? (
        <Button
          {...testProps(LL.common.next())}
          title={nextTitle || LL.common.next()}
          containerStyle={styles.buttonContainerStyle}
          buttonStyle={styles.buttonStyle}
          titleProps={{ style: styles.buttonText }}
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
