/* eslint-disable react/display-name */
import { createStackNavigator } from "@react-navigation/stack"
import "node-libs-react-native/globals" // needed for Buffer?
import { MarketPlaceParamList } from "@app/modules/market-place/navigation/param-list"

import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  from,
  InMemoryCache,
} from "@apollo/client"

import { setContext } from "@apollo/client/link/context"
import { useAppConfig } from "@app/hooks"
import {
  GRAPHQL_MARKET_PLACE_MAINNET_URI,
  GRAPHQL_MARKET_PLACE_STAGING_URI,
} from "../config"
import { onError } from "@apollo/client/link/error"
import { toastShow } from "@app/utils/toast"

export const cache = new InMemoryCache({ addTypename: false })

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
}

export const initPuravidaMarketPlaceClient = () => {
  const { appConfig } = useAppConfig()

  const uri =
    appConfig.galoyInstance.name === "Staging"
      ? GRAPHQL_MARKET_PLACE_STAGING_URI
      : GRAPHQL_MARKET_PLACE_MAINNET_URI
  const httpLink = createHttpLink({ uri })

  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${appConfig.token}`,
      },
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // graphqlErrors should be managed locally
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        toastShow({ message, type: "error", LL })
        if (message === "PersistedQueryNotFound") {
          console.log(`[GraphQL info]: Message: ${message}, Path: ${path}}`, {
            locations,
          })
        } else {
          console.warn(`[GraphQL error]: Message: ${message}, Path: ${path}}`, {
            locations,
          })
        }
      })
    }
  })

  const client = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache,
    defaultOptions,
  })

  return client
}
