import { TranslationFunctions } from "@app/i18n/i18n-types"

export const validateEmail = ({
  value,
  LL,
}: {
  value?: string
  LL: TranslationFunctions
}) => {
  if (!value) {
    return LL.KYCScreen.validations.emailRequired()
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(value)) {
    return LL.KYCScreen.validations.emailInvalid()
  }

  return true
}

export const validatePhoneNumber = ({
  value,
  LL,
}: {
  value?: string
  LL: TranslationFunctions
}) => {
  if (!value) {
    return LL.KYCScreen.validations.phoneRequired()
  }
  const phoneRegex = /^[+]*[0-9]{1,4}[-\s]?[0-9]{1,15}$/

  if (!phoneRegex.test(value)) {
    return LL.KYCScreen.validations.phoneInvalid()
  }

  return true
}

export const validateGender = ({
  value,
  LL,
}: {
  value?: string
  LL: TranslationFunctions
}) => {
  if (!value) {
    return LL.KYCScreen.validations.genderRequired()
  }
}
