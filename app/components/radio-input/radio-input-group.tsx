import { useEffect, useState } from "react"
import { View } from "react-native"
import useStyles from "./styles"
import RadioInput, { Option } from "./radio-input"

interface Props {
  group: Option[]
  value: string
  onChange?: (value?: string) => void
}

const RadioGroup = ({ group, value, onChange }: Props) => {
  const [checked, setChecked] = useState<string | undefined>("")
  const styles = useStyles()

  useEffect(() => {
    setChecked(value)
  }, [value])

  const handleChange = (value?: string) => {
    setChecked(value)
    onChange?.(value)
  }

  return (
    <View style={styles.container}>
      {group?.map((radio, index) => {
        return (
          <RadioInput
            key={index}
            option={radio}
            value={checked}
            onChange={handleChange}
          />
        )
      })}
    </View>
  )
}

export default RadioGroup
