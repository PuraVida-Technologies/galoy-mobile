import { gql } from "@apollo/client"

export const CREATE_POST = gql`
  mutation createPost(
    $address: String
    $description: String!
    $email: String
    $imagesUrls: [String!]
    $latitude: Float!
    $longitude: Float!
    $mainImageUrl: String!
    $name: String!
    $openHours: String
    $phoneNumber: String
    $userId: String!
    $tagsIds: [String!]
    $hidePhoneNumber: Boolean!
  ) {
    createMarketplacePost(
      createMarketplacePostInput: {
        address: $address
        description: $description
        email: $email
        imagesUrls: $imagesUrls
        latitude: $latitude
        longitude: $longitude
        mainImageUrl: $mainImageUrl
        name: $name
        openHours: $openHours
        phoneNumber: $phoneNumber
        userId: $userId
        hidePhoneNumber: $hidePhoneNumber
        tagsIds: $tagsIds
      }
    ) {
      status
      _id
    }
  }
`

export const CREATE_TAG = gql`
  mutation createMarketplaceTag($name: String!) {
    createMarketplaceTag(createMarketplaceTagInput: { name: $name }) {
      name
      _id
    }
  }
`