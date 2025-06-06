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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  headerIconContainer: {
    marginRight: 16,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  spacingBelowCurrencyLabel: {
    marginBottom: 16,
  },
  bottomView: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    flex: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingVertical: 4,
  },
  checkbox: {
    padding: 0,
    margin: 0,
    marginRight: 12,
    backgroundColor: "transparent",
    borderWidth: 0,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  link: {
    marginBottom: 16,
    marginLeft: 46,
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  checkboxSection: {
    marginBottom: 0,
  },
}))

export default useStyles
