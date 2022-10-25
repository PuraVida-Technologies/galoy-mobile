import { GoogleMapLocation, MarketplaceTag, PlaceCoordinates } from "@app/constants/model"
import { PostAttributes } from "@app/redux/reducers/store-reducer"
import { CREATE_TAG } from "../mutations/marketplace-mutation"
import {
  AUTO_COMPLETE_LOCATION,
  AUTO_COMPLETE_TAGS,
  FILTER_MARKET_PLACE_POST,
  GET_LOCATION_LAT_LONG,
  GET_TAGS,
} from "../queries/marketplace-query"
import PuravidaClient from "./client"
import {
  autoCompleteLocationHandler,
  autoCompleteTagHandler,
  createTagHandle,
  getLocationLatLongHandler,
  getTagsHandler,
} from "./handler"
type FilterPostParams = {
  latitude: number
  longitude: number
  maxDistance?: number
  minDistance?: number
  tagId?: string
  text?: string
}
export const autoCompleteTags = async (name: string): Promise<MarketplaceTag[]> => {
  let res = await PuravidaClient.query({ query: AUTO_COMPLETE_TAGS, variables: { name } })
  let formattedResponse = autoCompleteTagHandler(res)
  return formattedResponse
}

export const getTags = async (): Promise<MarketplaceTag[]> => {
  let res = await PuravidaClient.query({ query: GET_TAGS })
  let formattedResponse = getTagsHandler(res)
  return formattedResponse
}
export const autoComplete = async (name: string): Promise<GoogleMapLocation[]> => {
  let res = await PuravidaClient.query({
    query: AUTO_COMPLETE_LOCATION,
    variables: { name },
  })
  let formattedResponse = autoCompleteLocationHandler(res)
  return formattedResponse
}
export const getPlaceCoordinates = async (id: string): Promise<PlaceCoordinates> => {
  let res = await PuravidaClient.query({
    query: GET_LOCATION_LAT_LONG,
    variables: { id },
  })
  let formattedResponse = getLocationLatLongHandler(res)
  return formattedResponse
}

export const createTag = async (name: string) => {
  let res = await PuravidaClient.mutate({ mutation: CREATE_TAG, variables: { name } })
  let formattedResponse = createTagHandle(res)
  return formattedResponse
}
export const filterPosts = async (
  params: FilterPostParams,
): Promise<PostAttributes[]> => {
  let res = await PuravidaClient.query({
    query: FILTER_MARKET_PLACE_POST,
    variables: params,
  })
  console.log("filterPosts res: ", res)
  return []
}
