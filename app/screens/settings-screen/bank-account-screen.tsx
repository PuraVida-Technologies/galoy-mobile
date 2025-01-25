import { SafeAreaView, View } from "react-native"
import useStyles from "./bank-account/styles"
import { Screen } from "@app/components/screen"
import { testProps } from "@app/utils/testProps"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Button } from "@rneui/themed"
import Input from "@app/components/form-input/form-input"
import { Controller } from "react-hook-form"
import useBankAccount from "./bank-account/hooks/useBankAccount"

const BankAccountScreen = () => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { state, actions } = useBankAccount()
  const { control, loading } = state

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen
        preset="scroll"
        style={styles.screenStyle}
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Controller
            name="accountHolderName"
            control={control}
            rules={{
              required: "Account Holder Name is required",
              maxLength: { value: 50, message: "Max length is 50 characters" },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                onChangeText={(text) => field.onChange(text)}
                label={LL.BankAccountScreen.accountHolderName()}
                {...testProps(LL.BankAccountScreen.accountHolderName())}
                placeholder={LL.BankAccountScreen.accountHolderName()}
                autoCapitalize="none"
                maxLength={50}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="bankName"
            control={control}
            rules={{
              required: "Bank Name is required",
              maxLength: { value: 50, message: "Max length is 50 characters" },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.bankName())}
                label={LL.BankAccountScreen.bankName()}
                placeholder={LL.BankAccountScreen.bankName()}
                autoCapitalize="none"
                maxLength={50}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />
          <Controller
            name="currency"
            control={control}
            rules={{
              required: "Currency is required",
              pattern: {
                value: /^[A-Z]{3}$/,
                message: "Currency must be a 3-letter ISO code (e.g., USD)",
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.currency())}
                label={LL.BankAccountScreen.currency()}
                placeholder={LL.BankAccountScreen.currency()}
                autoCapitalize="characters"
                maxLength={3}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />
          <Controller
            name="iban"
            control={control}
            rules={{
              required: "IBAN is required",
              pattern: {
                value: /^[A-Z0-9]{15,34}$/,
                message: "IBAN must be 15 to 34 alphanumeric characters",
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.iban())}
                label={LL.BankAccountScreen.iban()}
                placeholder={LL.BankAccountScreen.iban()}
                autoCapitalize="none"
                maxLength={34}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />
          <Controller
            name="nationalId"
            control={control}
            rules={{
              required: "National ID is required",
              pattern: {
                value: /^[A-Z0-9]{6,20}$/,
                message: "National ID must be 6 to 20 alphanumeric characters",
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.nationalId())}
                label={LL.BankAccountScreen.nationalId()}
                placeholder={LL.BankAccountScreen.nationalId()}
                autoCapitalize="none"
                maxLength={20}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />
          <Controller
            name="sinpeCode"
            control={control}
            rules={{
              required: "Snipe Code is required",
              maxLength: { value: 20, message: "Max length is 20 characters" },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.snipeCode())}
                label={LL.BankAccountScreen.snipeCode()}
                placeholder={LL.BankAccountScreen.snipeCode()}
                autoCapitalize="none"
                maxLength={20}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />
          <Controller
            name="swiftCode"
            control={control}
            rules={{
              required: "SWIFT Code is required",
              pattern: {
                value: /^[A-Z0-9]{8,11}$/,
                message: "SWIFT Code must be 8 or 11 alphanumeric characters",
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.swiftCode())}
                label={LL.BankAccountScreen.swiftCode()}
                placeholder={LL.BankAccountScreen.swiftCode()}
                autoCapitalize="none"
                maxLength={11}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />

          <Button
            {...testProps(LL.common.submit())}
            title={LL.common.submit()}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={[styles.buttonStyle]}
            titleProps={{
              style: [styles.buttonText],
            }}
            onPress={actions.handleSubmit(actions.onSubmit)}
            disabled={loading}
            loading={loading}
          />
        </View>
      </Screen>
    </SafeAreaView>
  )
}

export default BankAccountScreen
