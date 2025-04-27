import React, { useState } from "react"
import { Icon, makeStyles, Text } from "@rneui/themed"
import useBankAccounts from "@app/modules/bank-account/hooks/useBankAccounts"
import { Pressable, View, Alert } from "react-native"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { Screen } from "@app/components/screen"
import { SettingsRow } from "./row"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { palette } from "@app/theme/palette"
import { useRemoveMyBankAccountMutation } from "@app/graphql/generated"

const BackAccountsScreen = () => {
  const [hovering, setHovering] = useState(false)
  const styles = useStyles({ hovering })
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()

  const {
    state: { data, loading },
    actions: { confirmRemoveBankAccount },
  } = useBankAccounts({ LL })

  const [removeMyBankAccount] = useRemoveMyBankAccountMutation()

  const handleRemoveBankAccount = async (accountId: string) => {
    Alert.alert(
      LL.common.confirm(),
      LL.BankAccountScreen.confirmRemoveBankAccountTitle(),
      [
        {
          text: LL.common.cancel(),
          style: "cancel",
        },
        {
          text: LL.common.remove(),
          style: "destructive",
          onPress: async () => {
            try {
              await removeMyBankAccount({
                variables: { bankAccountId: accountId },
                // Refetch the "bankAccounts" query after the mutation
                refetchQueries: ["bankAccounts"],
              })
              Alert.alert(
                LL.common.success(),
                LL.BankAccountScreen.accountRemovedSuccessfully(),
              )
            } catch (error) {
              console.error("Error removing bank account:", error)
              Alert.alert(LL.common.error(), LL.BankAccountScreen.removeAccountError())
            }
          },
        },
      ],
    )
  }

  return (
    <>
      {loading && (
        <LoadingComponent
          isLoading={loading}
          color={palette.orange}
          styles={styles.loadingContainer}
        />
      )}
      <Screen
        preset="scroll"
        style={styles.screenStyle}
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {data?.getMyBankAccounts?.map((account) => (
            <React.Fragment key={account.id}>
              <Pressable
                onPress={() => {
                  navigate("addBankAccount", { account })
                }}
              >
                <View style={[styles.spacing, styles.internalContainer]}>
                  <View>
                    <View style={styles.sidetoside}>
                      <Text type="p2">{account.data.accountAlias}</Text>
                    </View>

                    <Text type={"p4"} ellipsizeMode="tail" numberOfLines={1}>
                      {account.data.currency}
                    </Text>
                  </View>
                  <Icon
                    name="trash"
                    type="ionicon"
                    color="red"
                    onPress={() => handleRemoveBankAccount(account.id)}
                  />
                </View>
              </Pressable>
              {account.id !==
                data?.getMyBankAccounts?.[data.getMyBankAccounts.length - 1]?.id && (
                <View style={styles.borderBottom}></View>
              )}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.container}>
          <SettingsRow
            title={LL.common.addBankAccount()}
            rightIcon="add"
            action={() => navigate("addBankAccount")}
            // disabled={data?.me?.kyc?.status !== "APPROVED"}
          />
        </View>
      </Screen>
    </>
  )
}

const useStyles = makeStyles(({ colors }) => ({
  screenStyle: {
    padding: 20,
  },
  loadingContainer: {
    zIndex: 10,
    backgroundColor: "rgba(255,255,255, 0.5)",
  },
  container: {
    backgroundColor: colors.grey5,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.grey4,
  },
  spacing: {
    paddingHorizontal: 16,
    paddingRight: 12,
    paddingVertical: 12,
  },
  center: {
    justifyContent: "space-around",
  },
  rightActionTouchArea: {
    padding: 12,
    backgroundColor: colors.red,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  rightActionText: {
    color: colors.white,
    fontWeight: "bold",
  },
  sidetoside: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  internalContainer: {
    flex: 2,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
}))

export default BackAccountsScreen
