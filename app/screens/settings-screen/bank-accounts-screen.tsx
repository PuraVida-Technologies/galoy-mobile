import React, { useState } from "react"
import { Icon, makeStyles, Text } from "@rneui/themed"
import useBankAccounts from "./bank-account/hooks/useBankAccounts"
import { testProps } from "@app/utils/testProps"
import { Pressable, View } from "react-native"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "@app/components/screen"
import { SettingsRow } from "./row"
import { useI18nContext } from "@app/i18n/i18n-react"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { useSettingsScreenQuery } from "@app/graphql/generated"

const BackAccountsScreen = () => {
  const [hovering, setHovering] = useState(false)
  const styles = useStyles({ hovering })
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
  // const { data, loading } = useSettingsScreenQuery()
  const {
    state: { data, loading },
  } = useBankAccounts()

  if (loading) {
    return <LoadingComponent isLoading={loading} />
  }

  return (
    <Screen
      preset="scroll"
      style={styles.screenStyle}
      keyboardOffset="navigationHeader"
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {data?.getMyBankAccounts?.map((account, index) => (
          <Pressable
            key={index}
            onPress={() => {
              navigate("bankAccount", { account })
            }}
            // {...testProps(title)}
          >
            <View
              style={[
                styles.spacing,
                styles.internalContainer,
                index !== data?.getMyBankAccounts?.length - 1 && styles.borderBottom,
              ]}
            >
              <View>
                <View style={styles.sidetoside}>
                  <Text type="p2">{account.data.accountHolderName}</Text>
                </View>
                <Text>{account.data.iban}</Text>

                <Text type={"p4"} ellipsizeMode="tail" numberOfLines={1}>
                  {account.data.currency}
                </Text>
              </View>
              <Icon name={"chevron-forward"} type="ionicon" />
            </View>
          </Pressable>
        ))}
      </View>
      <View style={styles.container}>
        <SettingsRow
          title={LL.common.addBankAccount()}
          rightIcon="add"
          action={() => navigate("bankAccount")}
          // disabled={data?.me?.kyc?.status !== "APPROVED"}
        />
      </View>
    </Screen>
  )
}

const useStyles = makeStyles(
  ({ colors }, { hovering, shorter }: { hovering: boolean; shorter?: boolean }) => ({
    screenStyle: {
      padding: 20,
    },
    container: {
      backgroundColor: colors.grey5,
      borderRadius: 12,
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
      marginRight: -12,
      position: "relative",
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
  }),
)

export default BackAccountsScreen
