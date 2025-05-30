import React, { FC, PropsWithChildren } from "react"
import { TouchableHighlight } from "react-native"

import { testProps } from "@app/utils/testProps"
import { Button, ButtonProps, makeStyles } from "@rneui/themed"

export const GaloyPrimaryButton: FC<PropsWithChildren<ButtonProps>> = (props) => {
  const styles = useStyles()

  return (
    <Button
      {...(typeof props.title === "string" ? testProps(props.title) : {})}
      activeOpacity={0.85}
      {...props}
      titleStyle={[styles.titleStyle, props?.titleStyle]}
      TouchableComponent={TouchableHighlight}
      buttonStyle={[styles.buttonStyle, props?.buttonStyle]}
      disabledStyle={[styles.disabledStyle, props?.disabledStyle]}
      disabledTitleStyle={[styles.disabledTitleStyle, props?.disabledTitleStyle]}
    />
  )
}

const useStyles = makeStyles(({ colors }) => ({
  titleStyle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.white,
  },
  disabledTitleStyle: {
    color: colors.grey5,
  },
  buttonStyle: {
    minHeight: 50,
    backgroundColor: colors.primary3,
  },
  disabledStyle: {
    opacity: 0.5,
    backgroundColor: colors.primary3,
  },
}))
