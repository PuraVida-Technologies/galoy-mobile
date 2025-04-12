import { TranslationFunctions } from "@app/i18n/i18n-types"

export const validateIban = (iban: string, LL: TranslationFunctions) => {
  if (iban === "") {
    return LL.BankAccountScreen.validation.ibanRequired()
  }
  const trimmed = iban.replace(/\s+/g, "").toUpperCase()

  if (trimmed.length !== 22) {
    return LL.BankAccountScreen.validation.ibanLength()
  }

  if (!trimmed.startsWith("CR")) {
    return LL.BankAccountScreen.validation.ibanStart()
  }

  const rearranged = trimmed.slice(4) + trimmed.slice(0, 4)
  const numericIban = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString(),
  )

  if (mod97(numericIban) !== 1) {
    return LL.BankAccountScreen.validation.ibanMod97()
  }

  return true
}

export const validateSwift = (swift: string, LL: TranslationFunctions) => {
  if (swift === "") {
    return LL.BankAccountScreen.validation.swiftRequired()
  }
  const trimmed = swift.toUpperCase()
  const swiftRegex = /^[A-Z]{4}CR[A-Z0-9]{2}([A-Z0-9]{3})?$/

  if (!swiftRegex.test(trimmed)) {
    return LL.BankAccountScreen.validation.swiftFormat()
  }

  return true
}

const mod97 = (ibanNumeric: string) => {
  let remainder = ""
  for (let i = 0; i < ibanNumeric.length; i += 7) {
    const part = remainder + ibanNumeric.substring(i, i + 7)
    remainder = (parseInt(part, 10) % 97).toString()
  }
  return parseInt(remainder, 10)
}

export const validateSnip = (value: string, LL: TranslationFunctions) => {
  if (value === "") {
    return LL.BankAccountScreen.validation.sinpeRequired()
  }
  const snipRegex = /^\d{17}$/

  if (!snipRegex.test(value)) {
    return LL.BankAccountScreen.validation.sinpeFormat()
  }

  return true
}

export const validateCurrency = (value: string, LL: TranslationFunctions) => {
  if (value === "") {
    return LL.BankAccountScreen.validation.currencyRequired()
  }
  const currencyRegex = /^[A-Z]{3}$/

  if (!currencyRegex.test(value)) {
    return LL.BankAccountScreen.validation.currencyFormat()
  }

  return true
}

export const validateNationalId = (value: string, LL: TranslationFunctions) => {
  if (value === "") {
    return LL.BankAccountScreen.validation.nationalIdRequired()
  }
  const digitsOnly = /^\d+$/

  if (!digitsOnly.test(value)) {
    return LL.BankAccountScreen.validation.nationalIdFormat()
  }

  return true
}

export const validateAccountHolderName = (value: string, LL: TranslationFunctions) => {
  if (value === "") {
    return LL.BankAccountScreen.validation.accountHolderNameRequired()
  }
  if (value.length > 50) {
    return LL.BankAccountScreen.validation.accountHolderNameLength()
  }

  return true
}

export const validateBankName = (value: string, LL: TranslationFunctions) => {
  if (value === "") {
    return LL.BankAccountScreen.validation.bankNameRequired()
  }
  if (value.length > 50) {
    return LL.BankAccountScreen.validation.bankNameRequired()
  }

  return true
}
