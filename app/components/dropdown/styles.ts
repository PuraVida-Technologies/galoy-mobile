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
    color: colors.grey3,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    fontSize: 16,
  },
}))

export default useStyles
