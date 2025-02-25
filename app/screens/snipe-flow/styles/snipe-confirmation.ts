import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  scrollViewContainer: {
    flexDirection: "column",
  },
  snipeInfoCard: {
    margin: 20,
    backgroundColor: colors.grey5,
    borderRadius: 16,
    padding: 20,
  },
  snipeInfoField: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: colors.grey4,
  },
  snipeInfoFieldTitle: { color: colors.grey1, marginBottom: 4 },
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
  sellAmountContainer: {
    marginTop: 8,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  totalAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellAmount: {
    flexDirection: "row",
  },
  contentContainer: {
    flexGrow: 1,
  },
  completedText: {
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 28,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentSuccessBtn: {
    marginTop: 34,
  },
}))
export type UseSnipeConfirmationStyles = ReturnType<typeof useStyles>
export default useStyles
