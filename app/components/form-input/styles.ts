import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  container: {
    marginBottom: 20,
  },
  textContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 48,
  },
  inputContainerStyle: {
    flex: 1,
    borderWidth: 2,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    borderColor: colors.primary5,
    borderRadius: 8,
  },
  input: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  label: {
    color: colors.grey0,
  },
}))

export default useStyles
