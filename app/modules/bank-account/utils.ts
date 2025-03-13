export const prepareBankAccountDetails = (data) => {
  return {
    accountHolderName: data.accountHolderName,
    bankName: data.bankName,
    currency: data.currency,
    swiftCode: data.swiftCode,
    iban: data.iban,
    snipeCode: data.snipeCode,
    nationalId: data.nationalId,
  }
}
