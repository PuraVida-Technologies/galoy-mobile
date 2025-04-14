import React, { forwardRef } from "react"
import { InputProps, Input as REInput } from "@rneui/themed"
import useStyles from "./styles"
import FormContainer from "./form-container"
import { TextInput, View } from "react-native"

interface Props extends InputProps {
  label?: string
}

// eslint-disable-next-line react/display-name
const Input = forwardRef<TextInput, Props>(({ label, ...rest }, ref) => {
  const styles = useStyles()
  return (
    <FormContainer label={label}>
      <View style={styles.inputContainer}>
        <REInput
          ref={ref} // Forward the ref to the underlying REInput
          autoCapitalize="none"
          inputContainerStyle={styles.inputContainerStyle}
          renderErrorMessage={false}
          containerStyle={styles.input}
          {...rest}
        />
      </View>
    </FormContainer>
  )
})

export default Input
