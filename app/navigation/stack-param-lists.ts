import {
  BankAccountCr,
  BankAccountDataCr,
  PhoneCodeChannelType,
  UserContact,
  WalletCurrency,
} from "@app/graphql/generated"
import { EarnSectionType } from "@app/screens/earns-screen/sections"
import { PhoneLoginInitiateType } from "@app/screens/phone-auth-screen"
import {
  PaymentDestination,
  ReceiveDestination,
} from "@app/screens/send-bitcoin-screen/payment-destination/index.types"
import { PaymentDetail } from "@app/screens/send-bitcoin-screen/payment-details/index.types"
import { PaymentSendCompletedStatus } from "@app/screens/send-bitcoin-screen/use-send-payment"
import { DisplayCurrency, MoneyAmount, WalletOrDisplayCurrency } from "@app/types/amounts"
import { WalletDescriptor } from "@app/types/wallets"
import { NavigatorScreenParams } from "@react-navigation/native"

import { AuthenticationScreenPurpose, PinScreenPurpose } from "../utils/enum"

// Puravida Stack
import { PostAttributes } from "@app/modules/market-place/redux/reducers/store-reducer"
import { WalletBalance } from "@app/graphql/wallets-utils"

export type RootStackParamList = {
  getStarted: undefined
  liteDeviceAccount: {
    appCheckToken: string
  }
  developerScreen: undefined
  bankAccounts: undefined
  authenticationCheck: undefined
  authentication: {
    screenPurpose: AuthenticationScreenPurpose
    isPinEnabled: boolean
  }
  pin: { screenPurpose: PinScreenPurpose }
  earnsSection: { section: EarnSectionType }
  earnsQuiz: { id: string }
  scanningQRCode: undefined
  settings: undefined
  addressScreen: undefined
  defaultWallet: undefined
  theme: undefined
  sendBitcoinDestination?: {
    payment?: string
    username?: string
    autoValidate?: boolean
  }
  sendBitcoinDetails: {
    paymentDestination: PaymentDestination
  }
  sendBitcoinConfirmation: {
    paymentDetail: PaymentDetail<WalletCurrency>
  }
  conversionDetails: undefined
  conversionConfirmation: {
    fromWalletCurrency: WalletCurrency
    moneyAmount: MoneyAmount<WalletOrDisplayCurrency>
  }
  conversionSuccess: undefined
  sinpeDetails: { screenTitle?: string }
  bankAccount: undefined
  sinpeWithdrawalConfirmation: {
    fromWalletCurrency: WalletCurrency
    moneyAmount: MoneyAmount<WalletOrDisplayCurrency>
    fromAccountBalance: string
    bankAccount: Partial<BankAccountDataCr> & { id?: string }
    wallet?: WalletBalance
    screenTitle?: string
  }
  sinpeDepositConfirmation: {
    fromWalletCurrency: WalletCurrency
    moneyAmount: MoneyAmount<WalletOrDisplayCurrency>
    fromAccountBalance: string
    bankAccount: Partial<BankAccountDataCr> & { id?: string }
    wallet?: WalletBalance
    screenTitle?: string
  }
  Primary: undefined
  sendBitcoinCompleted: {
    arrivalAtMempoolEstimate?: number
    status: PaymentSendCompletedStatus
  }
  language: undefined
  currency: undefined
  security: {
    mIsBiometricsEnabled: boolean
    mIsPinEnabled: boolean
  }
  lnurl: { username: string }
  sectionCompleted: { amount: number; sectionTitle: string }
  priceHistory: undefined
  receiveBitcoin: undefined
  redeemBitcoinDetail: {
    receiveDestination: ReceiveDestination
  }
  redeemBitcoinResult: {
    callback: string
    domain: string
    k1: string
    defaultDescription: string
    minWithdrawableSatoshis: MoneyAmount<typeof WalletCurrency.Btc>
    maxWithdrawableSatoshis: MoneyAmount<typeof WalletCurrency.Btc>
    receivingWalletDescriptor: WalletDescriptor<typeof WalletCurrency.Btc>
    unitOfAccountAmount: MoneyAmount<WalletOrDisplayCurrency>
    settlementAmount: MoneyAmount<typeof WalletCurrency.Btc>
    displayAmount: MoneyAmount<DisplayCurrency>
  }
  phoneFlow: NavigatorScreenParams<PhoneValidationStackParamList>
  phoneRegistrationInitiate: undefined
  phoneRegistrationValidate: { phone: string; channel: PhoneCodeChannelType }
  transactionDetail: { txid: string }
  transactionHistory?: undefined
  Earn: undefined
  accountScreen: undefined
  notificationSettingsScreen: undefined
  transactionLimitsScreen: undefined
  KYCScreen: undefined
  addBankAccount?: { account?: Omit<Partial<BankAccountCr>, "__typename"> }
  emailRegistrationInitiate: undefined
  emailRegistrationValidate: { email: string; emailRegistrationId: string }
  emailLoginInitiate: undefined
  emailLoginValidate: { email: string; emailLoginId: string }
  totpRegistrationInitiate: undefined
  totpRegistrationValidate: { totpRegistrationId: string }
  totpLoginValidate: { authToken: string }
  webView: { url: string; initialTitle?: string }
  fullOnboardingFlow: undefined
  chatbot: undefined

  // Puravida Stack
  PostDetail: {
    editable?: boolean
    postInfo: PostAttributes
    postId?: string
    title?: string
    isMyPost?: boolean
  }
  LocationPicker: undefined
}

export type PeopleStackParamList = {
  peopleHome: undefined
  contactDetail: { contact: UserContact }
  circlesDashboard: undefined
  allContacts: undefined
}

export type PhoneValidationStackParamList = {
  Primary: undefined
  phoneLoginInitiate: {
    type: PhoneLoginInitiateType
  }
  phoneLoginValidate: {
    phone: string
    channel: PhoneCodeChannelType
    type: PhoneLoginInitiateType
  }
  authentication: {
    screenPurpose: AuthenticationScreenPurpose
  }
  Home: undefined
  totpLoginValidate: { authToken: string }
}

export type ContactStackParamList = {
  contactList: undefined
  contactDetail: { contact: Contact }
  phoneFlow: undefined
  sendBitcoinDestination: { username: string }
  transactionDetail: { txid: string }
}

export type PrimaryStackParamList = {
  Home: undefined
  Contacts: undefined
  Map: undefined
  Earn: undefined
  Web: undefined

  // Puravida Stack
  MarketPlaceStack: undefined
}
