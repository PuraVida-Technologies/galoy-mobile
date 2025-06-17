import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { Text, Divider } from "@rneui/themed"
import { useI18nContext } from "@app/i18n/i18n-react"
import useStyles from "./styles"
import Stepper from "./stepper"
import { TabProps } from "./hooks/useKYCState"
import { stepWidth } from "./hooks/utils"
import { Screen } from "@app/components/screen"
import { Dropdown } from "@app/components/dropdown"
import { gql, useQuery } from "@apollo/client"
import { MaritalStatus } from "@app/graphql/generated"

const SUPPORTED_COUNTRIES_QUERY = gql`
  query SupportedCountries {
    globals {
      supportedCountries {
        id
        supportedAuthChannels
      }
    }
  }
`

const maritalStatusOptions = Object.values(MaritalStatus).map((status) => ({
  label: status,
  value: status,
}))

const PlaceOfBirth = ({ jumpTo, KYCDetails, setKYCDetails }: TabProps) => {
  const styles = useStyles()
  const { LL } = useI18nContext()
  const { data, loading } = useQuery(SUPPORTED_COUNTRIES_QUERY)
  const [country, setCountry] = useState(KYCDetails?.placeOfBirth || "")
  const [maritalStatus, setMaritalStatus] = useState(KYCDetails?.maritalStatus || "")

  useEffect(() => {
    setKYCDetails({
      ...KYCDetails,
      placeOfBirth: country,
      maritalStatus,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, maritalStatus])

  const countryOptions =
    data?.globals?.supportedCountries?.map((c) => ({
      label: c.id,
      value: c.id,
    })) || []

  return (
    <View style={{ width: stepWidth }}>
      <Screen preset="scroll">
        <View style={styles.container}>
          <View>
            <Text type="h2">{LL.KYCScreen.placeOfBirth()}</Text>
            <Divider style={styles.titleContainer} />
          </View>
          <Dropdown
            data={countryOptions}
            value={country}
            label={LL.KYCScreen.placeOfBirth()}
            onChange={(item) => setCountry(item?.value)}
            loading={loading}
          />
          <Dropdown
            data={maritalStatusOptions}
            value={maritalStatus}
            label={LL.KYCScreen.maritalStatus()}
            onChange={(item) => setMaritalStatus(item?.value)}
          />
        </View>
      </Screen>
      <Stepper
        jumpTo={jumpTo}
        allowNext={Boolean(country && maritalStatus)}
        nextPage={3}
        previous
        previousPage={1}
      />
    </View>
  )
}

export default PlaceOfBirth