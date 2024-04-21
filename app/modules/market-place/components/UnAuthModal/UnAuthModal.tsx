import * as React from "react"
import { View } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import Modal from "react-native-modal"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Text, makeStyles, useTheme } from "@rneui/themed"
import { GaloyPrimaryButton } from "@app/components/atomic/galoy-primary-button"
import { PhoneLoginInitiateType } from "@app/screens/phone-auth-screen"

type Props = {
  modalVisible: boolean
  setModalVisible: (isOpen: boolean) => void
}

// The same modal used in move-money-screen.tsx
export const UnAuthModal = ({ modalVisible, setModalVisible }: Props) => {
  const { LL } = useI18nContext()

  const navigation = useNavigation<any>()

  const activateWallet = () => {
    setModalVisible(false)
    navigation.navigate("phoneFlow", {
      screen: "phoneLoginInitiate",
      params: {
        type: PhoneLoginInitiateType.CreateAccount,
      },
    })
  }
 
  const styles = useStyles()
  const {
    theme: { colors },
  } = useTheme()


  return (
    <Modal
      style={styles.modal}
      isVisible={modalVisible}
      swipeDirection={modalVisible ? ["down"] : ["up"]}
      onSwipeComplete={() => setModalVisible(false)}
      swipeThreshold={50}
    >
    <View style={styles.flex}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.cover} />
      </TouchableWithoutFeedback>
    </View>
    <View style={styles.viewModal}>
      <Icon name="remove" size={64} color={colors.grey3} style={styles.icon} />
      <Text type="h1">{LL.common.needWallet()}</Text>
      <View style={styles.openWalletContainer}>
        <GaloyPrimaryButton
          title={LL.GetStartedScreen.logInCreateAccount()}
          onPress={activateWallet}
        />
      </View>
      <View style={styles.flex} />
    </View>
    </Modal>
  )
}

const useStyles = makeStyles(({ colors }) => ({
  openWalletContainer: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  tintColor: {
    color: colors.primary,
  }, 
  listItems: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  }, 
  buttonContainerStyle: {
    marginTop: 16,
    width: "80%",
  },
  noTransaction: {
    alignItems: "center",
  },
  text: {
    color: colors.grey5,
    fontSize: 20,
  },
  titleStyle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    height: 34,
    top: -22,
  },
  buttonStyle: {
    borderColor: colors.primary,
    borderRadius: 32,
    borderWidth: 2,
  },
  modal: {
    marginBottom: 0,
    marginHorizontal: 0,
  },
  flex: {
    flex: 1,
  },
  cover: {
    height: "100%",
    width: "100%",
  },
  viewModal: {
    alignItems: "center",
    backgroundColor: colors.white,
    height: "25%",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },  
  balanceHeaderContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  error: {
    alignSelf: "center",
    color: colors.error,
  },
}))
