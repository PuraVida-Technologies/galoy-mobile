import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles(({ colors }) => ({
  flexRow: {
    flexDirection: "row",
  },
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
    alignItems: "center",
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
  },
  errorDetailsText: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
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
  remainingLimitContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  fieldTitleText: {
    textTransform: "lowercase",
    color: colors.grey1,
    marginLeft: 4,
  },
  primaryCurrencySymbol: {
    color: colors.grey1,
  },
  sellAmountColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sellAmountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  satsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
}))
export type UseSnipeConfirmationStyles = ReturnType<typeof useStyles>
export default useStyles
