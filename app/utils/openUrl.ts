import { Linking } from "react-native"

export const goToURL = (url: string) => {
  if (url) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        if (url?.includes("https://")) {
          Linking.openURL(url)
        } else {
          Linking.openURL("https://" + url)
        }
      } else {
        console.log("Don't know how to open URI: " + url)
      }
    })
  }
}
