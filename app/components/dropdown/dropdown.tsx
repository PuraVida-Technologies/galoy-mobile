import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { Dropdown as RNDropDown } from "react-native-element-dropdown"
import useStyles from "./styles"

export type Options = {
  label: string
  value: string
}

export type MenuSelectProps = {
  data: Options[]
  onChange?: (option: Options) => void
  placeholder?: string
  value?: string
}

export const Dropdown: React.FC<MenuSelectProps> = ({
  data,
  placeholder,
  value: selectedValue,
  onChange,
}) => {
  const [value, setValue] = useState(null)
  const styles = useStyles()

  useEffect(() => {
    setValue(selectedValue)
  }, [selectedValue])

  return (
    <>
      <RNDropDown
        style={styles.containerStyle}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || "Select item"}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => {
          setValue(item?.value)
          onChange?.(item)
        }}
      />
    </>
  )
}

export default Dropdown
