import { useState } from "react"
import { ActivityIndicator, Pressable, TextProps, View } from "react-native"

import { testProps } from "@app/utils/testProps"
import { makeStyles, Icon, Text, Skeleton } from "@rneui/themed"
import { IconType } from "@rneui/base"

type Props = {
  title: string
  subtitle?: string
  subtitleShorter?: boolean
  iconType?: IconType
  leftIcon?: string
  rightIcon?: string | null | React.ReactElement
  extraComponentBesideTitle?: React.ReactElement
  action: (() => void | Promise<void>) | null
  rightIconAction?: () => void | Promise<void>
  loading?: boolean
  spinner?: boolean
  shorter?: boolean
  disabled?: boolean
  subtitleStyles?: TextProps["style"]
}

export const SettingsRow: React.FC<Props> = ({
  title,
  subtitle,
  subtitleShorter,
  leftIcon,
  rightIcon = "",
  action,
  rightIconAction = action,
  extraComponentBesideTitle = <></>,
  loading,
  spinner,
  shorter,
  iconType = "ionicon",
  subtitleStyles,
  disabled,
}) => {
  const [hovering, setHovering] = useState(false)
  const styles = useStyles({ hovering, shorter })

  if (loading) return <Skeleton style={styles.container} animation="pulse" />
  if (spinner)
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    )

  const RightIcon =
    rightIcon !== null &&
    (typeof rightIcon === "string" ? (
      <Icon name={rightIcon ? rightIcon : "chevron-forward"} type="ionicon" />
    ) : (
      rightIcon
    ))
  const LeftIcon =
    leftIcon !== null &&
    (typeof leftIcon === "string" ? (
      <Icon name={leftIcon ? leftIcon : "home-outline"} type={iconType || "ionicon"} />
    ) : (
      leftIcon
    ))

  return (
    <Pressable
      onPressIn={action ? () => setHovering(true) : () => {}}
      onPressOut={action ? () => setHovering(false) : () => {}}
      onPress={action ? action : undefined}
      {...testProps(title)}
      disabled={disabled}
    >
      <View style={[styles.container, styles.spacing, disabled && styles.disabled]}>
        <View style={[styles.container, styles.spacing, styles.internalContainer]}>
          <>{LeftIcon}</>
          <View>
            <View style={styles.sidetoside}>
              <Text type="p2">{title}</Text>
              <Text>{extraComponentBesideTitle}</Text>
            </View>
            {subtitle && (
              <Text
                type={subtitleShorter ? "p4" : "p3"}
                ellipsizeMode="tail"
                numberOfLines={1}
                style={subtitleStyles}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <Pressable
          disabled={disabled}
          onPress={rightIconAction ? rightIconAction : undefined}
          {...testProps(title + "-right")}
        >
          <View style={styles.rightActionTouchArea}>{RightIcon}</View>
        </Pressable>
      </View>
    </Pressable>
  )
}

const useStyles = makeStyles(
  ({ colors }, { hovering, shorter }: { hovering: boolean; shorter?: boolean }) => ({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      columnGap: 16,
      backgroundColor: hovering ? colors.grey4 : undefined,
      minHeight: shorter ? 56 : 64,
    },
    disabled: {
      opacity: 0.5,
      backgroundColor: colors.grey4,
    },
    spacing: {
      paddingHorizontal: 8,
      paddingRight: 12,
      paddingVertical: 6,
    },
    center: {
      justifyContent: "space-around",
    },
    rightActionTouchArea: {
      padding: 12,
      marginRight: -12,
      position: "relative",
    },
    sidetoside: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      columnGap: 5,
    },
    internalContainer: {
      flex: 2,
      justifyContent: "flex-start",
      paddingRight: 16,
    },
  }),
)
