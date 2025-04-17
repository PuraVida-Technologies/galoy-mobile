import { SafeAreaView, View, Alert, Text } from "react-native"
import useStyles from "@app/modules/bank-account/styles"
import { Screen } from "@app/components/screen"
import { testProps } from "@app/utils/testProps"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Button, Icon } from "@rneui/themed"
import Input from "@app/components/form-input/form-input"
import { Controller } from "react-hook-form"
import useBankAccount from "@app/modules/bank-account/hooks/useAddBankAccount"
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native"
import { BankAccountCr, useRemoveMyBankAccountMutation } from "@app/graphql/generated"
import {
  validateAccountHolderName,
  validateBankName,
  validateCurrency,
  validateIban,
  validateNationalId,
  validateSnip,
  validateSwift,
} from "@app/modules/bank-account/validators"
import FormContainer from "@app/components/form-input/form-container"
import Dropdown from "@app/components/dropdown/dropdown"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@app/navigation/stack-param-lists"

const AddBankAccountScreen = () => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { params } =
    useRoute<RouteProp<{ params: { account: BankAccountCr } }, "params">>()
  const { state, actions } = useBankAccount({ account: params?.account, LL })
  const { control, loading } = state

  const [removeMyBankAccount] = useRemoveMyBankAccountMutation()

  const handleRemoveBankAccount = async () => {
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
                variables: { bankAccountId: params?.account?.id },
              })
              navigate("bankAccounts")
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
    <SafeAreaView style={styles.safeArea}>
      <Screen
        preset="scroll"
        style={styles.screenStyle}
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        {params?.account && (
          <Icon
            name="trash"
            type="ionicon"
            color="red"
            onPress={handleRemoveBankAccount}
            containerStyle={styles.headerIconContainer}
          />
        )}
        <View style={styles.container}>
          <Controller
            name="accountHolderName"
            control={control}
            rules={{
              validate: (value) => validateAccountHolderName(value, LL),
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
              validate: (value) => validateBankName(value, LL),
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
              validate: (value) => validateCurrency(value, LL),
            }}
            render={({ field, fieldState }) => (
              <FormContainer label={LL.BankAccountScreen.currency()}>
                <Dropdown
                  {...testProps(LL.BankAccountScreen.currency())}
                  data={[
                    { label: "USD", value: "USD" },
                    { label: "CRC", value: "CRC" },
                  ]}
                  placeholder={LL.BankAccountScreen.currency()}
                  value={field.value}
                  onChange={(item) => field.onChange(item.value)}
                />
                {fieldState.error?.message ? (
                  <Text style={styles.errorText}>{fieldState.error.message}</Text>
                ) : null}
              </FormContainer>
            )}
          />
          <Controller
            name="iban"
            control={control}
            rules={{
              validate: (value) => validateIban(value, LL),
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.iban())}
                label={LL.BankAccountScreen.iban()}
                placeholder={LL.BankAccountScreen.iban()}
                autoCapitalize="characters"
                maxLength={22}
                errorMessage={fieldState.error?.message}
                {...field}
                value={
                  field.value?.startsWith("CR") ? field.value : `CR${field.value || ""}`
                }
                onChangeText={(text) => {
                  const updatedValue = text.startsWith("CR") ? text : `CR${text}`
                  field.onChange(updatedValue)
                }}
              />
            )}
          />
          <Controller
            name="nationalId"
            control={control}
            rules={{
              validate: (value) => validateNationalId(value, LL),
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.nationalId())}
                label={LL.BankAccountScreen.nationalId()}
                placeholder={LL.BankAccountScreen.nationalId()}
                autoCapitalize="none"
                maxLength={20}
                keyboardType="numeric"
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
              validate: (value) => validateSnip(value, LL),
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.sinpeCode())}
                label={LL.BankAccountScreen.sinpeCode()}
                placeholder={LL.BankAccountScreen.sinpeCode()}
                autoCapitalize="characters"
                maxLength={17}
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
              validate: (value) => validateSwift(value, LL),
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.swiftCode())}
                label={LL.BankAccountScreen.swiftCode()}
                placeholder={LL.BankAccountScreen.swiftCode()}
                autoCapitalize="characters"
                maxLength={11}
                errorMessage={fieldState.error?.message}
                {...field}
                onChangeText={(text) => field.onChange(text)}
              />
            )}
          />

          <Button
            {...testProps(LL.common.submit())}
            title={params?.account ? LL.common.save() : LL.common.submit()}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={[styles.buttonStyle]}
            titleProps={{
              style: [styles.buttonText],
            }}
            color={"primary"}
            onPress={actions.handleSubmit(actions.onSubmit)}
            disabled={loading}
            loading={loading}
          />
        </View>
      </Screen>
    </SafeAreaView>
  )
}

export default AddBankAccountScreen
