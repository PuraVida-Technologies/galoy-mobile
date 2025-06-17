import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  loadingContainer: {
    zIndex: 10,
    backgroundColor: colors.backdropWhiter,
  },
  displayNone: {
    display: "none",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  screenStyle: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
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
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  buttonContainerStyle: {
    paddingBottom: 0,
    flex: 1,
  },
  perviousButtonContainer: {
    marginRight: 10,
  },
  buttonStyle: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
  },
  previousStyle: {
    backgroundColor: colors.grey4,
  },
  disabled: {
    backgroundColor: colors.grey4,
    color: colors.grey1,
    opacity: 0.8,
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
  documentTypeDropDown: {
    height: 48, // needed because flex: 1 will not work in tab view
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
  image: { width: "100%", height: 200 },
  disclosuresText: {
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  formFieldContainer: {
    marginBottom: 24,
  },
  countryPickerContainer: {
    borderWidth: 1,
    borderColor: colors.grey4,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    marginBottom: 4,
  },
  countryPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },
  countryPickerText: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
    marginLeft: 8,
  },
  countryPickerPlaceholder: {
    fontSize: 16,
    color: colors.grey3,
    flex: 1,
    marginLeft: 8,
  },
}))

export default useStyles
