import React, { useEffect, useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { Text, Divider, Icon } from "@rneui/themed"
import { useI18nContext } from "@app/i18n/i18n-react"
import useStyles from "./styles"
import Stepper from "./stepper"
import { TabProps } from "./hooks/useKYCState"
import { stepWidth } from "./hooks/utils"
import { Screen } from "@app/components/screen"
import { Dropdown } from "@app/components/dropdown"
import { gql, useQuery } from "@apollo/client"
import { MaritalStatus, Country as GraphQLCountry } from "@app/graphql/generated"
import CountryPicker, { CountryCode, Country } from "react-native-country-picker-modal"

const SUPPORTED_COUNTRIES_KYC_QUERY = gql`
  query SupportedCountriesKyc {
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
  const { data, loading } = useQuery(SUPPORTED_COUNTRIES_KYC_QUERY)
  const [country, setCountry] = useState<CountryCode>(KYCDetails?.idDetails?.placeOfBirth as CountryCode || "US")
  const [countryName, setCountryName] = useState<string>("")
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | "">(KYCDetails?.idDetails?.maritalStatus || "")
  const [showPicker, setShowPicker] = useState(false)

  // Get flag emoji for country code
  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '🌍'
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0))
      return String.fromCodePoint(...codePoints)
    } catch {
      return '🌍'
    }
  }

  // Initialize country name if country is already selected
  useEffect(() => {
    if (country && !countryName) {
      setCountryName(country)
    }
  }, [country, countryName])

  useEffect(() => {
    setKYCDetails({
      ...KYCDetails,
      idDetails: {
        ...KYCDetails?.idDetails,
        placeOfBirth: country,
        maritalStatus: maritalStatus || undefined,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, maritalStatus])

  const countryOptions =
    data?.globals?.supportedCountries?.map((c: GraphQLCountry) => ({
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
          
          {/* Place of Birth Section */}
          <View style={styles.formFieldContainer}>
            <Text type="p2" style={styles.inputLabel}>
              {LL.KYCScreen.placeOfBirthLabel()}
            </Text>
            <TouchableOpacity 
              style={styles.countryPickerContainer}
              onPress={() => setShowPicker(true)}
            >
              <View style={styles.countryPickerButton}>
                <Text style={{ fontSize: 24, marginRight: 8 }}>
                  {getFlagEmoji(country)}
                </Text>
                <Text style={countryName ? styles.countryPickerText : styles.countryPickerPlaceholder}>
                  {countryName || 'Select your country'}
                </Text>
                <Icon name="chevron-down" type="feather" size={20} color="#666" />
              </View>
            </TouchableOpacity>
            <CountryPicker
              withFilter
              withFlag
              withCountryNameButton={false}
              countryCode={country}
              onSelect={(selectedCountry) => {
                setCountry(selectedCountry.cca2)
                setCountryName(selectedCountry.cca2)
              }}
              visible={showPicker}
              onClose={() => setShowPicker(false)}
            />
          </View>

          {/* Marital Status Section */}
          <View style={styles.formFieldContainer}>
            <Text type="p2" style={styles.inputLabel}>
              {LL.KYCScreen.maritalStatusLabel()}
            </Text>
            <Dropdown
              data={maritalStatusOptions}
              value={maritalStatus}
              onChange={(item) => setMaritalStatus(item?.value as MaritalStatus)}
            />
          </View>
        </View>
      </Screen>
      <Stepper
        jumpTo={jumpTo}
        allowNext={Boolean(country && maritalStatus)}
        nextPage={4}
        previous
        previousPage={2}
        onNext={() => {
          console.log('Next button clicked:', { country, maritalStatus, allowNext: Boolean(country && maritalStatus) })
        }}
      />
    </View>
  )
}

export default PlaceOfBirth