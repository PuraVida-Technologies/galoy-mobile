import { AndroidMarket } from "react-native-rate"

export const WHATSAPP_CONTACT_NUMBER = "+50685048290"
export const CONTACT_EMAIL_ADDRESS = "support@puravidabitcoin.io"
export const APP_STORE_LINK =
  "https://apps.apple.com/us/app/pura-vida-bitcoin/id6443837514"
export const PLAY_STORE_LINK =
  "https://play.google.com/store/apps/details?id=io.puravidabitcoin.app"
export const PREFIX_LINKING = [
  "https://ln.bitcoinbeach.com",
  "https://pay.mainnet.galoy.io",
  "https://pay.bbw.sv",
  "https://pay.blink.sv",
  "bitcoinbeach://",
]

// FIXME this should come from globals.lightningAddressDomainAliases
export const LNURL_DOMAINS = ["ln.bitcoinbeach.com", "pay.bbw.sv", "blink.sv"]

export const ratingOptions = {
  AppleAppID: "6443837514",
  GooglePackageName: "io.puravidabitcoin.app",
  preferredAndroidMarket: AndroidMarket.Google,
  preferInApp: true,
  openAppStoreIfInAppFails: true,
}

export const getInviteLink = (_username: string | null | undefined) => {
  const username = _username ? `/${_username}` : ""
  return `https://get.blink.sv${username}`
}
