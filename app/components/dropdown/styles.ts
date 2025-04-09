import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  containerStyle: {
    flex: 1,
    borderWidth: 2,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    borderColor: colors.primary5,
    borderRadius: 8,
    minHeight: 48,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.grey3, // Keep the existing placeholder color
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.text, // Dynamically set the text color based on the theme
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: colors.text, // Dynamically set the icon color based on the theme
  },
  inputSearchStyle: {
    fontSize: 16,
    color: colors.text, // Dynamically set the search input text color
    backgroundColor: colors.background, // Dynamically set the search input background color
  },
}))

export default useStyles
