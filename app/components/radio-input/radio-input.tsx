import { useEffect, useState } from "react"
import { TextStyle, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import useStyles from "./styles"
import { Text } from "@rneui/themed"

export type Option = {
  label: string
  value?: string
  style?: TextStyle
}

interface Props {
  option: Option
  value: string
  onChange?: (checked: string) => void
}

const RadioInput = ({ option, value, onChange }: Props) => {
  const [checked, setChecked] = useState(false)
  const styles = useStyles()

  useEffect(() => {
    setChecked(option?.value === value)
  }, [option?.value, value])

  const onSelect = () => {
    onChange?.(option?.value)
    setChecked(!checked)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onSelect}>
        <Icon
          style={[styles.icon, option?.style, checked && styles.activeRadio]}
          name={checked ? "circle-slice-8" : "circle-outline"}
          size={25}
        />
      </TouchableOpacity>
      <Text type="p2">{option?.label}</Text>
    </View>
  )
}

export default RadioInput
