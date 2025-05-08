import { makeStyles } from "@rneui/themed"
import { Platform } from "react-native"

const useStyles = makeStyles(({ colors }) => ({
  scrollViewContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  toFieldContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginRight: 75,
  },
  walletSelectorContainer: {
    flexDirection: "row",
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 5, // Reduce the spacing between the containers
  },
  walletsContainer: {
    flex: 1,
  },
  walletSeparator: {
    flexDirection: "row",
    height: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    backgroundColor: colors.grey4,
    height: 1,
    flex: 1,
  },
  switchButton: {
    height: 50,
    width: 50,
    borderRadius: 50,
    elevation: Platform.OS === "android" ? 50 : 0,
    backgroundColor: colors.grey4,
    justifyContent: "center",
    alignItems: "center",
  },
  fromFieldContainer: {
    flexDirection: "row",
    marginBottom: 15,
    marginRight: 75,
  },
  percentageFieldLabel: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 10,
  },
  walletSelectorInfoContainer: {
    flex: 1,
    flexDirection: "column",
  },
  walletCurrencyText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  walletSelectorBalanceContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  percentageFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    flexWrap: "wrap",
  },
  percentageField: {
    backgroundColor: colors.grey5,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    minWidth: 80,
  },
  percentageLabelContainer: {
    flex: 1,
  },
  percentageContainer: {
    flexDirection: "row",
  },
  buttonContainer: { marginHorizontal: 20, marginBottom: 20 },
  errorContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  pickWalletIcon: {},
  walletSelectorTypeTextContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  walletSelectorTypeLabelUsdText: {
    fontWeight: "bold",
    color: colors.black,
  },
  walletSelectorTypeLabelBtcText: {
    fontWeight: "bold",
    color: colors.white,
  },
  walletSelectorTypeLabelUsd: {
    height: 30,
    width: 50,
    backgroundColor: colors._green,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  walletSelectorTypeLabelBitcoin: {
    height: 30,
    width: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  walletSelectorTypeContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 50,
    marginRight: 20,
  },
  fieldBackground: {
    flexDirection: "row",
    borderStyle: "solid",
    overflow: "hidden",
    backgroundColor: colors.grey5,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  fieldTitleText: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  walletContainer: {
    flexDirection: "row",
    borderStyle: "solid",
    overflow: "hidden",
    backgroundColor: colors.grey5,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    minHeight: 60,
  },
  modal: {
    marginBottom: "90%",
  },
  spacing: {
    paddingHorizontal: 16,
    paddingRight: 12,
    paddingVertical: 12,
    flex: 1,
  },
  container: {
    height: "100%",
    marginHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 60,
  },
  bankModal: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  cardContainer: {
    backgroundColor: colors.grey5,
    borderRadius: 12,
    marginBottom: 20,
    height: 80,
  },
  searchBarContainer: {
    backgroundColor: colors.white,
    borderBottomColor: colors.white,
    borderTopColor: colors.white,
    marginVertical: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: colors.grey5,
  },
  searchBarRightIconStyle: {
    padding: 8,
  },
  searchBarText: {
    color: colors.black,
    textDecorationLine: "none",
  },
  icon: {
    color: colors.black,
  },
  closeIcon: {
    fontSize: 40,
    alignItems: "flex-end",
    position: "absolute",
    right: -10,
    top: 16,
  },
  numberText: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
  },
  numberContainer: {
    flex: 1,
  },
  numberInputContainer: {
    borderBottomWidth: 0,
  },
  amountContainer: {
    flexDirection: "column",
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  primaryCurrencySymbol: {
    fontSize: 20,
    fontWeight: "bold",
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  remainingLimitContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  fieldText: {
    textTransform: "lowercase",
    color: colors.grey1,
    marginLeft: 4,
  },
  toggleButtonContainer: {
    position: "absolute",
    right: 40, // Keep it aligned to the right
    zIndex: 1, // Ensure it appears above other elements
    pointerEvents: "box-none", // Allow touch events to pass through to underlying elements
  },
  toggleButton: {
    width: 50, // Set a fixed width
    height: 50, // Set a fixed height to make it circular
    borderRadius: 25, // Half of the width/height for a perfect circle
    backgroundColor: "#f0f0f0", // Background color
    justifyContent: "center", // Center the icon vertically
    alignItems: "center", // Center the icon horizontally
    shadowColor: "#000", // Add shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  toggleButtonContainerInline: {
    position: "absolute", // Position the button absolutely
    top: "30%", // Place it halfway between the two containers
    left: "80%", // Center it horizontally
    transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust for the button's size
    zIndex: 2, // Ensure it appears above the wallet selector containers
  },
}))
export type UseSnipDetailsStyles = ReturnType<typeof useStyles>
export default useStyles
