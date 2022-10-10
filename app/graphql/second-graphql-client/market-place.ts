

import { GoogleMapLocation, MarketplaceTag, PlaceCoordinates } from "@app/constants/model";
import { AUTO_COMPLETE_LOCATION, AUTO_COMPLETE_TAGS, GET_LOCATION_LAT_LONG, GET_TAGS } from "../queries/marketplace-query";
import PuravidaClient from "./client"
import { autoCompleteLocationHandler, autoCompleteTagHandler, getLocationLatLongHandler, getTagsHandler } from "./handler";
export const autoCompleteTags = async (name:string): Promise<
  MarketplaceTag[]
> => {
  let res = await PuravidaClient.query({ query: AUTO_COMPLETE_TAGS,variables:{name} })
  let formattedResponse = autoCompleteTagHandler(res)
  return formattedResponse
}

export const getTags = async (): Promise<
MarketplaceTag[]
> => {
  let res = await PuravidaClient.query({ query: GET_TAGS })
  let formattedResponse = getTagsHandler(res)
  return formattedResponse
}
export const autoComplete = async (name:string): Promise<
GoogleMapLocation[]
> => {
  let res = await PuravidaClient.query({ query: AUTO_COMPLETE_LOCATION ,variables:{name}})
  let formattedResponse = autoCompleteLocationHandler(res)
  return formattedResponse
}
export const getPlaceCoordinates = async (id:string): Promise<
PlaceCoordinates
> => {
  let res = await PuravidaClient.query({ query: GET_LOCATION_LAT_LONG ,variables:{id}})
  let formattedResponse = getLocationLatLongHandler(res)
  return formattedResponse
}