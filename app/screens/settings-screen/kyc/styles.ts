import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  screenStyle: {
    padding: 20,
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  textContainer: {
    marginBottom: 10,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 20,
    backgroundColor: colors.white,
  },
  buttonContainerStyle: {
    paddingBottom: 0,
    flex: 1,
  },
  buttonStyle: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
  perviousStyle: {
    backgroundColor: colors.grey4,
    marginRight: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  buttonInActiveText: {
    color: colors.grey1,
  },
  inputContainer: {
    marginBottom: 20,
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
  pickerContainer: {
    backgroundColor: colors.grey4,
    padding: 16,
    paddingVertical: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
}))

export default useStyles
