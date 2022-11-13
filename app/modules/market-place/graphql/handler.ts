export const getMarketPlaceCategoriesHandler = (res: any) => {
  return res?.data?.getMarketplaceCategories
}
export const getPostsHandler = (res: any) => {
  return res?.data?.getMarketplacePosts || []
}
export const autoCompleteTagHandler = (res: any) => {
  return res?.data?.marketplaceAutoCompleteTag
}
export const getTagsHandler = (res: any) => {
  return res?.data?.getMarketplaceTags
}
export const autoCompleteLocationHandler = (res: any) => {
  return res?.data?.googleMapAutoComplete
}
export const getLocationLatLongHandler = (res: any) => {
  return res?.data?.googleMapPlaceCoordinates
}
export const createTagHandle = (res: any) => {
  return res?.data?.createMarketplaceTag
}
export const filterPostHandler = (res: any) => {
  return res?.data?.filterMarketplacePosts
}