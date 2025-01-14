import React from "react"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { testProps } from "@app/utils/testProps"
import Stepper from "./stepper"
import Input from "@app/components/form-input/form-input"
import { Divider, Text } from "@rneui/themed"
import { View } from "react-native"
import { Route } from "./hooks/useKYCState"

const UserDetails = ({ jumpTo, route }: Route) => {
  const styles = useStyles()
  const { LL } = useI18nContext()

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.userDetails()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <Input
          label={LL.common.email()}
          {...testProps(LL.EmailRegistrationInitiateScreen.placeholder())}
          placeholder={LL.EmailRegistrationInitiateScreen.placeholder()}
          autoCapitalize="none"
          value={route?.state?.idDetails?.email || route?.state?.email}
          onChangeText={(text) =>
            route?.setState({
              email: text,
              idDetails: { ...route?.state?.idDetails, email: text },
            })
          }
        />

        <Input
          {...testProps(LL.common.phoneNumber())}
          label={LL.common.phoneNumber()}
          placeholder={LL.common.phoneNumber()}
          autoCapitalize="none"
          keyboardType="numeric"
          value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
          onChangeText={(text) =>
            route?.setState({
              phoneNumber: text,
              idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            })
          }
        />

        <Input
          label={LL.common.gender()}
          {...testProps(LL.common.gender())}
          placeholder={LL.common.gender()}
          autoCapitalize="none"
          renderErrorMessage={false}
          value={route?.state?.idDetails?.gender || route?.state?.gender}
          onChangeText={(text) =>
            route?.setState({
              gender: text,
              idDetails: { ...route?.state?.idDetails, gender: text },
            })
          }
        />
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext={Boolean(
          (route?.state?.email && route?.state?.phoneNumber && route?.state?.gender) ||
            (route?.state?.idDetails?.email &&
              route?.state?.idDetails?.phoneNumber &&
              route?.state?.idDetails?.gender),
        )}
        pervious
        perviousPage={"docProof"}
        nextPage={"confirm"}
      />
    </>
  )
}

export default UserDetails
