import { useEffect, useState } from "react"
import { Dropdown } from "@app/components/dropdown"
import useStyles from "./styles"
import { useI18nContext } from "@app/i18n/i18n-react"
import { testProps } from "@app/utils/testProps"
import { View } from "react-native"
import Stepper from "./stepper"
import FormContainer from "@app/components/form-input/form-container"
import Input from "@app/components/form-input/form-input"
import { Divider, Text } from "@rneui/themed" // Import useTheme
import { IDType } from "./types"
import { Route } from "./hooks/useKYCState"

const data = [
  { label: "Drivers License", value: IDType.DriverLicense },
  { label: "Passport", value: IDType.Passport },
  { label: "Other", value: IDType.Other },
]

const DocumentType = ({ jumpTo, route }: Route) => {
  const [doc, setDoc] = useState("")
  const [otherDoc, setOtherDoc] = useState("")
  const styles = useStyles()
  const { LL } = useI18nContext()

  useEffect(() => {
    setDoc(route?.state?.idDetails?.type)
  }, [route?.state?.idDetails?.type])

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text type={"h2"}>{LL.KYCScreen.documentType()}</Text>
          <Divider style={styles.titleContainer} />
        </View>
        <FormContainer label={LL.KYCScreen.idType()}>
          <View style={styles.documentTypeDropDown}>
            <Dropdown
              data={data}
              value={doc}
              onChange={(item) => {
                setDoc(item?.value)
                route?.setState?.({
                  idDetails: { ...route?.state?.idDetails, type: item?.value },
                })
              }}
            />
          </View>
        </FormContainer>

        {doc === IDType.Other ? (
          <Input
            {...testProps(LL.KYCScreen.idType())}
            placeholder={LL.KYCScreen.idType()}
            autoCapitalize="none"
            value={otherDoc}
            onChangeText={(item) => {
              setOtherDoc(item)
              route?.setState?.({ IDType: item })
            }}
          />
        ) : (
          <></>
        )}
      </View>
      <Stepper
        jumpTo={jumpTo}
        allowNext={Boolean(route?.state?.idDetails?.type)}
        nextPage={"docProof"}
      />
    </>
  )
}

export default DocumentType
