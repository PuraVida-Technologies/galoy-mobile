import React, { useEffect } from "react"
import { SafeAreaView, View, Alert, Text } from "react-native"
import useStyles from "@app/modules/bank-account/styles"
import { Screen } from "@app/components/screen"
import { testProps } from "@app/utils/testProps"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Button, Icon } from "@rneui/themed"
import Input from "@app/components/form-input/form-input"
import { Controller, useWatch } from "react-hook-form"
import useAddBankAccount from "@app/modules/bank-account/hooks/useAddBankAccount"
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native"
import { BankAccountCr, useRemoveMyBankAccountMutation } from "@app/graphql/generated"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@app/navigation/stack-param-lists"

const AddBankAccountScreen = () => {
  const styles = {
    ...useStyles(),
    spacingBelowCurrencyLabel: {
      marginBottom: 16,
    },
  }
  const { LL } = useI18nContext()
  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { params } =
    useRoute<RouteProp<{ params: { account: BankAccountCr } }, "params">>()
  const { state, actions } = useAddBankAccount({ account: params?.account, LL })
  const { control, loading, bankDetails, getValues, setValue } = state
  const { handleSubmit, verifyIban, addBankAccount } = actions

  const ibanValue = useWatch({ control, name: "iban" }) // Watch the iban field
  const accountAliasValue = useWatch({ control, name: "accountAlias" }) // Watch the accountAlias field

  const isIbanValid = ibanValue?.startsWith("CR") && ibanValue?.length === 22 // Validate IBAN

  // Set default value for accountAlias when bankDetails changes
  useEffect(() => {
    if (bankDetails) {
      const defaultAlias = `${bankDetails.currencyCode}-${bankDetails.iban?.slice(-4)}`
      setValue("accountAlias", defaultAlias) // Explicitly set the value
    }
  }, [bankDetails, setValue])

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

  interface VerifyIbanData {
    iban: string
  }

  const handleVerifyIban = async (data: VerifyIbanData) => {
    try {
      await verifyIban(data.iban)
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(LL.common.error(), error.message)
      } else {
        Alert.alert(LL.common.error(), LL.BankAccountScreen.unknownError())
      }
    }
  }

  const handleSaveBankAccount = async (data: { accountAlias: string }) => {
    try {
      console.log("ibanValue is: ", ibanValue)
      const bankAccountData = { ...data, iban: ibanValue }
      console.log("bankAccountData is: ", bankAccountData)
      await addBankAccount(bankAccountData)
      Alert.alert(LL.common.success(), LL.BankAccountScreen.accountAddedSuccessfully())
    } catch (error) {
      Alert.alert(LL.common.error(), LL.BankAccountScreen.addAccountError())
    }
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
            name="iban"
            control={control}
            rules={{
              validate: (value) =>
                value.startsWith("CR") || LL.BankAccountScreen.invalidIban(),
            }}
            render={({ field, fieldState }) => (
              <Input
                {...testProps(LL.BankAccountScreen.iban())}
                label={LL.BankAccountScreen.iban()}
                placeholder={LL.BankAccountScreen.iban()}
                autoCapitalize="characters"
                maxLength={22}
                keyboardType="numeric"
                errorMessage={fieldState.error?.message}
                {...field}
                value={
                  field.value.startsWith("CR") ? field.value : `CR${field.value || ""}`
                }
                onChangeText={(text) => {
                  const updatedValue = text.startsWith("CR") ? text : `CR${text}`
                  field.onChange(updatedValue)
                }}
                editable={!bankDetails} // Disable input if IBAN is verified
              />
            )}
          />
          {!bankDetails && ( // Remove Verify button if IBAN is verified
            <Button
              {...testProps(LL.BankAccountScreen.verify())}
              title={LL.BankAccountScreen.verify()}
              containerStyle={styles.buttonContainerStyle}
              buttonStyle={[styles.buttonStyle]}
              titleProps={{ style: [styles.buttonText] }}
              color={"primary"}
              onPress={handleSubmit(handleVerifyIban)}
              disabled={!isIbanValid || loading} // Disable button if IBAN is invalid or loading
              loading={loading}
            />
          )}

          {bankDetails && (
            <View style={styles.spacingBelowCurrencyLabel}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>{LL.BankAccountScreen.bankName()}:</Text>{" "}
                {bankDetails?.bankName}
              </Text>
              <View style={styles.spacingBelowCurrencyLabel}>
                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>{LL.BankAccountScreen.currency()}:</Text>{" "}
                  {bankDetails?.currencyCode}
                </Text>
              </View>
              <Controller
                name="accountAlias"
                control={control}
                render={({ field }) => (
                  <Input
                    {...testProps(LL.BankAccountScreen.accountAlias())}
                    label={LL.BankAccountScreen.accountAlias()}
                    placeholder={LL.BankAccountScreen.accountAlias()}
                    autoCapitalize="none"
                    maxLength={50}
                    {...field}
                    onChangeText={(text) => field.onChange(text)}
                  />
                )}
              />
              <Button
                {...testProps(LL.common.save())}
                title={LL.common.save()}
                containerStyle={styles.buttonContainerStyle}
                buttonStyle={[styles.buttonStyle]}
                titleProps={{ style: [styles.buttonText] }}
                color={"primary"}
                onPress={handleSubmit(handleSaveBankAccount)}
                disabled={loading || !accountAliasValue} // Disable if loading or accountAlias is empty
                loading={loading}
              />
            </View>
          )}
        </View>
      </Screen>
    </SafeAreaView>
  )
}

export default AddBankAccountScreen
