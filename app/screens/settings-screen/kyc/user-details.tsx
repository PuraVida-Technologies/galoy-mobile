import React from "react"
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
import useUserDetails from "./hooks/useUserDetails"
import { Gender } from "@app/graphql/generated"

const radioGroup = [
  { label: "Male", value: Gender.Male },
  { label: "Female", value: Gender.Female, style: { marginLeft: 10 } },
  { label: "Other", value: Gender.Other, style: { marginLeft: 10 } },
]

const UserDetails = ({ jumpTo, route }: Route) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { state, actions } = useUserDetails({
    state: route.state,
    setState: route.setState,
  })

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
          value={state?.userDetails?.email || ""}
          onChangeText={(text) =>
            actions?.setUserDetails({
              email: text,
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
          value={state?.userDetails?.phoneNumber || ""}
          onChangeText={(text) =>
            actions?.setUserDetails({
              phoneNumber: text,
            })
          }
        />

        <FormContainer label={LL.common.gender()}>
          <RadioGroup
            group={radioGroup}
            value={state?.userDetails?.gender || ""}
            onChange={(value) => {
              actions?.setUserDetails({
                gender: value as Gender,
              })
            }}
          />
        </FormContainer>
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext={state.allowed && !state.loading}
        disableNext={!state.allowed && state.loading}
        previous
        previousPage={"docProof"}
        nextPage={"confirm"}
        onNext={() => actions?.onConfirm()}
      />
    </>
  )
}

export default UserDetails
