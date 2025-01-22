import { View } from "react-native"
import { Text } from "@rneui/themed"
import useStyles from "./styles"

interface Props {
  label?: string
  children?: React.ReactNode
}

const FormContainer = ({ label, children }: Props) => {
  const styles = useStyles()
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.textContainer}>
          <Text type={"p2"} style={styles.label}>
            {label}
          </Text>
        </View>
      )}
      {children}
    </View>
  )
}

export default FormContainer
