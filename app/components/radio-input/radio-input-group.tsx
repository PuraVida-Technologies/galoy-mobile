import React, { useEffect, useState, forwardRef } from "react"
import { View } from "react-native"
import useStyles from "./styles"
import RadioInput, { Option } from "./radio-input"

interface Props {
  group: Option[]
  value: string
  onChange?: (value?: string) => void
}

// eslint-disable-next-line react/display-name
const RadioGroup = forwardRef<View, Props>(({ group, value, onChange }, ref) => {
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
    <View ref={ref} style={styles.container}>
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
})

export default RadioGroup
