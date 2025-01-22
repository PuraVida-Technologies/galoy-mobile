import { InputProps, Input as REInput } from "@rneui/themed"
import useStyles from "./styles"
import FormContainer from "./form-container"
import { View } from "react-native"

interface Props extends InputProps {
  label?: string
}

const Input = ({ label, ...rest }: Props) => {
  const styles = useStyles()
  return (
    <FormContainer label={label}>
      <View style={styles.inputContainer}>
        <REInput
          autoCapitalize="none"
          inputContainerStyle={styles.inputContainerStyle}
          renderErrorMessage={false}
          containerStyle={styles.input}
          {...rest}
        />
      </View>
    </FormContainer>
  )
}

export default Input
