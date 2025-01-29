import React, { useMemo } from "react"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { testProps } from "@app/utils/testProps"
import Stepper from "./stepper"
import Input from "@app/components/form-input/form-input"
import { Divider, Text } from "@rneui/themed"
import { View } from "react-native"
import { Route } from "./hooks/useKYCState"
import RadioGroup from "@app/components/radio-input/radio-input-group"
import FormContainer from "@app/components/form-input/form-container"

const radioGroup = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE", style: { marginLeft: 10 } },
  { label: "Other", value: "OTHER", style: { marginLeft: 10 } },
]

const UserDetails = ({ jumpTo, route }: Route) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const allowed = useMemo(
    () =>
      Boolean(
        (route?.state?.email && route?.state?.phoneNumber && route?.state?.gender) ||
          (route?.state?.idDetails?.email &&
            route?.state?.idDetails?.phoneNumber &&
            route?.state?.idDetails?.gender),
      ),
    [
      route?.state?.email,
      route?.state?.gender,
      route?.state?.idDetails?.email,
      route?.state?.idDetails?.gender,
      route?.state?.idDetails?.phoneNumber,
      route?.state?.phoneNumber,
    ],
  )

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
          maxLength={13}
          value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
          onChangeText={(text) =>
            route?.setState({
              phoneNumber: text,
              idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            })
          }
        />

        <FormContainer label={LL.common.gender()}>
          <RadioGroup
            group={radioGroup}
            value={route?.state?.idDetails?.gender || route?.state?.gender}
            onChange={(value) => {
              route?.setState({
                gender: value,
                idDetails: { ...route?.state?.idDetails, gender: value },
              })
            }}
          />
        </FormContainer>
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext={allowed}
        disableNext={!allowed}
        previous
        previousPage={"docProof"}
        nextPage={"confirm"}
      />
    </>
  )
}

export default UserDetails
