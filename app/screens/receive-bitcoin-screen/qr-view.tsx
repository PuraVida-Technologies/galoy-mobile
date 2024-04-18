import * as React from "react"
import { useMemo } from "react"
import {
  ActivityIndicator,
  useWindowDimensions,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  Pressable,
  Animated,
  Easing,
} from "react-native"
import QRCode from "react-native-qrcode-svg"

import Logo from "@app/assets/logo/blink-logo-icon.png"

import { Invoice, InvoiceType, GetFullUriFn } from "./payment/index.types"

import { testProps } from "../../utils/testProps"
import { GaloyIcon } from "@app/components/atomic/galoy-icon"
import { SuccessIconAnimation } from "@app/components/success-animation"
<<<<<<< HEAD
import { makeStyles } from "@rneui/themed"
=======
import { makeStyles, Text, useTheme } from "@rneui/themed"
import { GaloyTertiaryButton } from "@app/components/atomic/galoy-tertiary-button"
import { useI18nContext } from "@app/i18n/i18n-react"
>>>>>>> galoy-upstream

const configByType = {
  [Invoice.Lightning]: {
    copyToClipboardLabel: "ReceiveScreen.copyClipboard",
    shareButtonLabel: "common.shareLightning",
    ecl: "L" as const,
    icon: "ios-flash",
  },
  [Invoice.OnChain]: {
    copyToClipboardLabel: "ReceiveScreen.copyClipboardBitcoin",
    shareButtonLabel: "common.shareBitcoin",
    ecl: "M" as const,
    icon: "logo-bitcoin",
  },
  // TODO: Add them
  [Invoice.PayCode]: {
    copyToClipboardLabel: "ReceiveScreen.copyClipboardBitcoin",
    shareButtonLabel: "common.shareBitcoin",
    ecl: "M" as const,
    icon: "logo-bitcoin",
  },
}

type Props = {
  type: InvoiceType
  getFullUri: GetFullUriFn | undefined
  loading: boolean
  completed: boolean
  err: string
  size?: number
  style?: StyleProp<ViewStyle>
  expired: boolean
  regenerateInvoiceFn?: () => void
  copyToClipboard?: () => void | undefined
  isPayCode: boolean
  canUsePayCode: boolean
  toggleIsSetLightningAddressModalVisible: () => void
}

export const QRView: React.FC<Props> = ({
  type,
  getFullUri,
  loading,
  completed,
  err,
  size = 280,
  style,
  expired,
  regenerateInvoiceFn,
  copyToClipboard,
  isPayCode,
  canUsePayCode,
  toggleIsSetLightningAddressModalVisible,
}) => {
<<<<<<< HEAD
=======
  const {
    theme: { colors },
  } = useTheme()
  const isPayCodeAndCanUsePayCode = isPayCode && canUsePayCode

  const isReady = (!isPayCodeAndCanUsePayCode || Boolean(getFullUri)) && !loading && !err
  const displayingQR =
    !completed && isReady && !expired && (!isPayCode || isPayCodeAndCanUsePayCode)

>>>>>>> galoy-upstream
  const styles = useStyles()
  const { scale } = useWindowDimensions()

  const { LL } = useI18nContext()

  const scaleAnim = React.useRef(new Animated.Value(1)).current

  const breatheIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start()
  }

  const breatheOut = () => {
    if (!expired && copyToClipboard) copyToClipboard()
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start()
  }

  const renderSuccessView = useMemo(() => {
    if (completed) {
      return (
<<<<<<< HEAD
        <View
          {...testProps("Success Icon")}
          style={[styles.container, styles.containerSuccess]}
        >
=======
        <View {...testProps("Success Icon")} style={[styles.container, style]}>
>>>>>>> galoy-upstream
          <SuccessIconAnimation>
            <GaloyIcon name={"payment-success"} size={128} />
          </SuccessIconAnimation>
        </View>
      )
    }
    return null
<<<<<<< HEAD
  }, [completed, styles])
=======
  }, [completed, styles, style])
>>>>>>> galoy-upstream

  const renderQRCode = useMemo(() => {
    const getQrLogo = () => {
      if (type === Invoice.OnChain) return Logo
      if (type === Invoice.Lightning) return Logo
      if (type === Invoice.PayCode) return Logo
      return null
    }

    const getQrSize = () => {
      if (Platform.OS === "android") {
        if (scale > 3) {
          return 195
        }
      }
      return size
    }

    if (displayingQR && getFullUri) {
      const uri = getFullUri({ uppercase: true })
      return (
        <View style={[styles.container, style]}>
          <QRCode
            size={getQrSize()}
            value={uri}
            logoBackgroundColor="white"
            ecl={type && configByType[type].ecl}
            logo={getQrLogo() || undefined}
            logoSize={60}
            logoBorderRadius={10}
          />
        </View>
      )
    }
    return null
<<<<<<< HEAD
  }, [completed, isReady, type, getFullUri, size, scale, styles])
=======
  }, [displayingQR, type, getFullUri, size, scale, styles, style])
>>>>>>> galoy-upstream

  const renderStatusView = useMemo(() => {
    if (!completed && !isReady) {
      return (
        <View style={[styles.container, style]}>
          <View style={styles.errorContainer}>
            {(err !== "" && (
              <Text style={styles.error} selectable>
                {err}
              </Text>
            )) || <ActivityIndicator size="large" color={colors.primary} />}
          </View>
        </View>
      )
    } else if (expired) {
      return (
        <View style={[styles.container, style]}>
          <Text type="p2" style={styles.expiredInvoice}>
            {LL.ReceiveScreen.invoiceHasExpired()}
          </Text>
          <GaloyTertiaryButton
            title={LL.ReceiveScreen.regenerateInvoiceButtonTitle()}
            onPress={regenerateInvoiceFn}
          ></GaloyTertiaryButton>
        </View>
      )
    } else if (isPayCode && !canUsePayCode) {
      return (
        <View style={[styles.container, styles.cantUsePayCode, style]}>
          <Text type="p2" style={styles.cantUsePayCodeText}>
            {LL.ReceiveScreen.setUsernameToAcceptViaPaycode()}
          </Text>
          <GaloyTertiaryButton
            title={LL.ReceiveScreen.setUsernameButtonTitle()}
            onPress={toggleIsSetLightningAddressModalVisible}
          ></GaloyTertiaryButton>
        </View>
      )
    }
    return null
<<<<<<< HEAD
  }, [err, isReady, completed, styles])
=======
  }, [
    err,
    isReady,
    completed,
    styles,
    style,
    colors,
    expired,
    isPayCode,
    canUsePayCode,
    LL.ReceiveScreen,
    regenerateInvoiceFn,
    toggleIsSetLightningAddressModalVisible,
  ])
>>>>>>> galoy-upstream

  return (
    <View style={styles.qr}>
      <Pressable
        onPressIn={displayingQR ? breatheIn : () => {}}
        onPressOut={displayingQR ? breatheOut : () => {}}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {renderSuccessView}
          {renderQRCode}
          {renderStatusView}
        </Animated.View>
      </Pressable>
    </View>
  )
}

<<<<<<< HEAD
const useStyles = makeStyles((theme) => ({
=======
const useStyles = makeStyles(({ colors }) => ({
>>>>>>> galoy-upstream
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors._white,
    width: "100%",
    height: undefined,
    borderRadius: 10,
    aspectRatio: 1,
    alignSelf: "center",
    padding: 16,
  },
  containerSuccess: {
<<<<<<< HEAD
    backgroundColor: theme.colors.white,
=======
    backgroundColor: colors.white,
>>>>>>> galoy-upstream
  },
  errorContainer: {
    justifyContent: "center",
    height: "100%",
  },
  error: { color: colors.error, alignSelf: "center" },
  qr: {
    alignItems: "center",
  },
<<<<<<< HEAD
=======
  expiredInvoice: {
    marginBottom: 10,
  },
  cantUsePayCode: {
    padding: "10%",
  },
  cantUsePayCodeText: {
    marginBottom: 10,
  },
>>>>>>> galoy-upstream
}))

export default React.memo(QRView)
