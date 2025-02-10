import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  scrollViewContainer: {
    flexDirection: "column",
  },
  snipeInfoCard: {
    margin: 20,
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 20,
  },
  snipeInfoField: {
    marginBottom: 20,
  },
  snipeInfoFieldTitle: { color: colors.grey1 },
  snipeInfoFieldValue: {
    color: colors.grey0,
    fontWeight: "bold",
    fontSize: 18,
  },
  snipeInfoSubFieldValue: {
    color: colors.grey0,
    fontWeight: "500",
    fontSize: 14,
  },
  buttonContainer: { marginHorizontal: 20, marginBottom: 20 },
  errorContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
  },
}))
export type UseSnipeConfirmationStyles = ReturnType<typeof useStyles>
export default useStyles
