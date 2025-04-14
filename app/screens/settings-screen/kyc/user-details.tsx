import React from "react"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { testProps } from "@app/utils/testProps"
import Stepper from "./stepper"
import Input from "@app/components/form-input/form-input"
import { Divider, Text } from "@rneui/themed"
import { View } from "react-native"
import { TabProps } from "./hooks/useKYCState"
import RadioGroup from "@app/components/radio-input/radio-input-group"
import FormContainer from "@app/components/form-input/form-container"
import useUserDetails from "./hooks/useUserDetails"
import { Gender } from "@app/graphql/generated"
import { stepWidth } from "./hooks/utils"
import { Controller } from "react-hook-form"
import { validateEmail, validateGender, validatePhoneNumber } from "./validators"
import { Screen } from "@app/components/screen"

const radioGroup = [
  { label: "Male", value: Gender.Male },
  { label: "Female", value: Gender.Female, style: { marginLeft: 10 } },
  { label: "Other", value: Gender.Other, style: { marginLeft: 10 } },
]

const UserDetails = ({
  jumpTo,
  isStepOneAndTwoCompleted,
  KYCDetails,
  setKYCDetails,
}: TabProps) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { state, actions } = useUserDetails({
    KYCDetails,
    jumpTo,
    setKYCDetails,
  })

  return (
    <View style={{ width: stepWidth }}>
      <Screen
        preset="scroll"
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View>
            <Text type={"h2"}>{LL.KYCScreen.userDetails()}</Text>
            <Divider style={styles.titleContainer} />
          </View>
          <Controller
            control={state.control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label={LL.common.email()}
                {...testProps(LL.EmailRegistrationInitiateScreen.placeholder())}
                placeholder={LL.EmailRegistrationInitiateScreen.placeholder()}
                autoCapitalize="none"
                {...field}
                value={field.value!}
                errorMessage={fieldState?.error?.message}
                onChangeText={(text) => {
                  field.onChange(text)
                }}
              />
            )}
            rules={{ validate: (value) => validateEmail({ value: value!, LL }) }}
          />

          <Controller
            control={state.control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.common.phoneNumber())}
                label={LL.common.phoneNumber()}
                placeholder={LL.common.phoneNumber()}
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={13}
                {...field}
                value={field.value!}
                errorMessage={fieldState?.error?.message}
                onChangeText={(text) => {
                  field.onChange(text)
                }}
              />
            )}
            rules={{ validate: (value) => validatePhoneNumber({ value: value!, LL }) }}
          />

          <Controller
            control={state.control}
            name="gender"
            render={({ field, fieldState }) => (
              <FormContainer label={LL.common.gender()}>
                <RadioGroup group={radioGroup} {...field} value={field.value!} />
                <Text type="p2" style={[styles.disclosuresText, styles.errorText]}>
                  {fieldState?.error?.message}
                </Text>
              </FormContainer>
            )}
            rules={{ validate: (value) => validateGender({ value: value!, LL }) }}
          />
        </View>
      </Screen>
      <Stepper
        allowNext={state.allowed && !state.loading}
        disableNext={!state.allowed || state.loading}
        isStepOneAndTwoCompleted={isStepOneAndTwoCompleted}
        previous
        previousPage={1}
        nextPage={3}
        onPrevious={() => jumpTo(1)}
        onNext={actions?.handleSubmit(actions?.onConfirm)}
      />
    </View>
  )
}

export default UserDetails
