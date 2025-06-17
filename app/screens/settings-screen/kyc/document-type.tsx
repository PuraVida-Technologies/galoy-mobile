import { useEffect, useState } from "react"
import { Dropdown } from "@app/components/dropdown"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { View } from "react-native"
import Stepper from "./stepper"
import FormContainer from "@app/components/form-input/form-container"
import { Divider, Text } from "@rneui/themed"
import { TabProps } from "./hooks/useKYCState"
import { stepWidth } from "./hooks/utils"
import { Screen } from "@app/components/screen"
import { IdentificationType } from "@app/graphql/generated"

const data = [
  { label: "Drivers License", value: IdentificationType.DrivingLicense },
  { label: "Passport", value: IdentificationType.Passport },
  { label: "National ID", value: IdentificationType.NationalId },
  { label: "Costa Rica Residence Card", value: IdentificationType.CrResidenceCard },
  { label: "Costa Rica ID Card", value: IdentificationType.CrLegalIdCard },
]

const DocumentType = ({ jumpTo, KYCDetails, setKYCDetails }: TabProps) => {
  const [doc, setDoc] = useState<string | undefined | null>("")
  const [otherDoc, setOtherDoc] = useState("")
  const styles = useStyles()
  const { LL } = useI18nContext()

  useEffect(() => {
    setDoc(KYCDetails?.idDetails?.type)
  }, [KYCDetails?.idDetails?.type])

  return (
    <>
      <View style={{ width: stepWidth }}>
        <Screen
          preset="scroll"
          keyboardOffset="navigationHeader"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View>
              <Text type={"h2"}>{LL.KYCScreen.documentType()}</Text>
              <Divider style={styles.titleContainer} />
            </View>
            <FormContainer label={LL.KYCScreen.idType()}>
              <View style={styles.documentTypeDropDown}>
                <Dropdown
                  data={data}
                  value={doc as string}
                  onChange={(item) => {
                    setDoc(item?.value)
                    setKYCDetails?.({
                      idDetails: { ...KYCDetails?.idDetails, type: item?.value },
                    })
                  }}
                />
              </View>
            </FormContainer>

            {/* {doc === IDType.Other ? (
              <Input
                {...testProps(LL.KYCScreen.idType())}
                placeholder={LL.KYCScreen.idType()}
                autoCapitalize="none"
                value={otherDoc}
                onChangeText={(item) => {
                  setOtherDoc(item)
                  setKYCDetails?.({ IDType: item })
                }}
              />
            ) : (
              <></>
            )} */}
          </View>
        </Screen>
        <Stepper
          jumpTo={jumpTo}
          allowNext={Boolean(KYCDetails?.idDetails?.type)}
          nextPage={1}
        />
      </View>
    </>
  )
}

export default DocumentType
