import React from "react"
import { StyleSheet, View, ActivityIndicator, ViewProps } from "react-native"

interface Props {
  isLoading: boolean
  styles?: ViewProps["style"]
  color?: string
}

export const LoadingComponent = ({ isLoading, styles, color }: Props) => {
  return (
    <>
      {isLoading && (
        <View
          style={[
            {
              backgroundColor: "rgba(12, 12, 12, 0.7)",
              justifyContent: "center",
              alignItems: "center",
            },
            styles,
            StyleSheet.absoluteFill,
          ]}
        >
          <ActivityIndicator size={"large"} color={color || "white"} />
        </View>
      )}
    </>
  )
}
