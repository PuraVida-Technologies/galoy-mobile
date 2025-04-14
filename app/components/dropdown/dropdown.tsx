import React, { useEffect, useState } from "react"
import { Dropdown as RNDropDown } from "react-native-element-dropdown"
import useStyles from "./styles"
import { useTheme } from "@rneui/themed"

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
  const [value, setValue] = useState<string | undefined | null>(null)
  const styles = useStyles()
  const { theme } = useTheme()

  useEffect(() => {
    setValue(selectedValue)
  }, [selectedValue])

  return (
    <>
      <RNDropDown
        style={styles.containerStyle}
        containerStyle={styles.innerContainer}
        placeholderStyle={styles.placeholderStyle}
        activeColor={theme.colors.grey5}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemTextStyle={styles.itemTextStyle}
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
