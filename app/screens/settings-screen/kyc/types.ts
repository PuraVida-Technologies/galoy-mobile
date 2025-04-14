import { Identification, Kyc } from "@app/graphql/generated"
import { AxiosResponse } from "axios"

export enum IDType {
  DriverLicense = "DRIVING_LICENSE",
  Passport = "PASSPORT",
  Other = "OTHER",
}

export enum PermissionStatus {
  UNAVAILABLE = "unavailable",
  BLOCKED = "blocked",
  DENIED = "denied",
  GRANTED = "granted",
  LIMITED = "limited",
}

export interface DocumentUploadResponse extends AxiosResponse {
  data: Document
}
export interface Document {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  gender: Kyc["gender"]
  maritalStatus: string | null
  placeOfBirth: string | null
  citizenships: []
  isPoliticallyExposed: string | null
  isHighRisk: string | null
  createdAt: string
  updatedAt: string
  status: string
  address: string | null
  galoyUserId: string
  primaryIdentification: Identification[]
}
