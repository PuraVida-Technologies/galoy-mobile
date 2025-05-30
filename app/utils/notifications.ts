// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from "react-native"

import { ApolloClient, gql } from "@apollo/client"
import { DeviceNotificationTokenCreateDocument } from "@app/graphql/generated"
import crashlytics from "@react-native-firebase/crashlytics"
import messaging from "@react-native-firebase/messaging"
import { uploadDeviceToken } from "@app/modules/market-place/graphql"
import { marketplaceClient } from "@app/graphql/client"

// No op if the permission has already been requested
export const requestNotificationPermission = () => messaging().requestPermission()

gql`
  mutation deviceNotificationTokenCreate($input: DeviceNotificationTokenCreateInput!) {
    deviceNotificationTokenCreate(input: $input) {
      errors {
        message
      }
      success
    }
  }
`

// This is a global variable to avoid adding the device token multiple times at the same time
let addingDeviceToken = false
export const addDeviceToken = async (client: ApolloClient<unknown>): Promise<void> => {
  if (addingDeviceToken) {
    return
  }
  addingDeviceToken = true

  try {
    const deviceToken = await messaging().getToken()

    console.log("Device token uploaded", deviceToken)

    // TODO: find out why marketplaceClient is undefined here
    // i do not have bandwidth to further look into this as i'm not familiar w/ marketplace
    if (marketplaceClient) {
      await uploadDeviceToken(deviceToken)
    }

    await client.mutate({
      mutation: DeviceNotificationTokenCreateDocument,
      variables: { input: { deviceToken } },
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      crashlytics().recordError(err)
    }
    console.error(err, "impossible to upload device token")
  }
  if (addingDeviceToken) {
    addingDeviceToken = false
  }
}

export const hasNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "ios") {
    const authorizationStatus = await messaging().hasPermission()
    return (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    )
  }

  if (Platform.OS === "android") {
    const authorizationStatusAndroid = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )
    return authorizationStatusAndroid === PermissionsAndroid.RESULTS.GRANTED || false
  }

  return false
}
