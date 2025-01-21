import { SafeAreaView, View } from "react-native"
import useStyles from "./bank-account/styles"
import { Screen } from "@app/components/screen"
import FormContainer from "@app/components/form-input/form-container"
import RadioGroup from "@app/components/radio-input/radio-input-group"
import { testProps } from "@app/utils/testProps"
import { Divider } from "@rneui/base"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Button, Text } from "@rneui/themed"
import Input from "@app/components/form-input/form-input"

const BankAccountScreen = () => {
  const styles = useStyles()
  const { LL } = useI18nContext()

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen
        preset="scroll"
        style={styles.screenStyle}
        keyboardOffset="navigationHeader"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Input
            label={LL.BankAccountScreen.accountHolderName()}
            {...testProps(LL.BankAccountScreen.accountHolderName())}
            placeholder={LL.BankAccountScreen.accountHolderName()}
            autoCapitalize="none"
            // value={route?.state?.idDetails?.email || route?.state?.email}
            // onChangeText={(text) =>
            //   route?.setState({
            //     email: text,
            //     idDetails: { ...route?.state?.idDetails, email: text },
            //   })
            // }
          />

          <Input
            {...testProps(LL.BankAccountScreen.bankName())}
            label={LL.BankAccountScreen.bankName()}
            placeholder={LL.BankAccountScreen.bankName()}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={13}
            // value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
            // onChangeText={(text) =>
            //   route?.setState({
            //     phoneNumber: text,
            //     idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            //   })
            // }
          />
          <Input
            {...testProps(LL.BankAccountScreen.currency())}
            label={LL.BankAccountScreen.currency()}
            placeholder={LL.BankAccountScreen.currency()}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={13}
            // value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
            // onChangeText={(text) =>
            //   route?.setState({
            //     phoneNumber: text,
            //     idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            //   })
            // }
          />
          <Input
            {...testProps(LL.BankAccountScreen.iban())}
            label={LL.BankAccountScreen.iban()}
            placeholder={LL.BankAccountScreen.iban()}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={13}
            // value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
            // onChangeText={(text) =>
            //   route?.setState({
            //     phoneNumber: text,
            //     idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            //   })
            // }
          />
          <Input
            {...testProps(LL.BankAccountScreen.nationalId())}
            label={LL.BankAccountScreen.nationalId()}
            placeholder={LL.BankAccountScreen.nationalId()}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={13}
            // value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
            // onChangeText={(text) =>
            //   route?.setState({
            //     phoneNumber: text,
            //     idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            //   })
            // }
          />
          <Input
            {...testProps(LL.BankAccountScreen.snipeCode())}
            label={LL.BankAccountScreen.snipeCode()}
            placeholder={LL.BankAccountScreen.snipeCode()}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={13}
            // value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
            // onChangeText={(text) =>
            //   route?.setState({
            //     phoneNumber: text,
            //     idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            //   })
            // }
          />
          <Input
            {...testProps(LL.BankAccountScreen.swiftCode())}
            label={LL.BankAccountScreen.swiftCode()}
            placeholder={LL.BankAccountScreen.swiftCode()}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={13}
            // value={route?.state?.idDetails?.phoneNumber || route?.state?.phoneNumber}
            // onChangeText={(text) =>
            //   route?.setState({
            //     phoneNumber: text,
            //     idDetails: { ...route?.state?.idDetails, phoneNumber: text },
            //   })
            // }
          />

          <Button
            {...testProps(LL.common.submit())}
            title={LL.common.submit()}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={[styles.buttonStyle]}
            titleProps={{
              style: [styles.buttonText],
            }}
            // onPress={onNextPage}
            // disabled={disableNext}
          />
        </View>
      </Screen>
    </SafeAreaView>
  )
}

export default BankAccountScreen
