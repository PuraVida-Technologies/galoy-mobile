import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  screenStyle: {
    padding: 20,
    // flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  buttonContainerStyle: {
    paddingBottom: 0,
    flex: 1,
  },
  removeButtonContainerStyle: {
    marginTop: 16,
    flex: 1,
  },
  buttonStyle: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  disabled: {
    backgroundColor: colors.grey4,
    color: colors.grey1,
  },
  buttonInActiveText: {
    color: colors.grey1,
  },
}))

export default useStyles
