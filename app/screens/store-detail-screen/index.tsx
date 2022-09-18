import * as React from "react"
import { useState } from "react"
// eslint-disable-next-line react-native/split-platform-components
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Screen } from "../../components/screen"
import { fontSize, typography } from "@app/theme"
import { HeaderComponent } from "@app/components/header"
import { images } from "@app/assets/images"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@app/redux"
import { FooterCreatePost } from "../create-post/footer"
import {
  MarketPlaceParamList,
  RootStackParamList,
} from "@app/navigation/stack-param-lists"
import { StackNavigationProp } from "@react-navigation/stack"
import CurrentLocation from "@asset/svgs/current-location.svg"
import CheckSvg from "@asset/svgs/check-icon.svg"
import { Row } from "@app/components/row"
import { CustomTextInput } from "@app/components/text-input"
import EditSvg from "@asset/svgs/edit-pen.svg"
import LocationSvg from "@asset/svgs/location.svg"
import LocationMarkerSvg from "@asset/svgs/location-marker.svg"
import { getLocation } from "@app/utils/helper"
import StarRating from "react-native-star-rating"
import { eng } from "@app/constants/en"
import { RouteProp, useRoute } from "@react-navigation/native"
import { createPost } from "@app/graphql/second-graphql-client"
import { LoadingComponent } from "@app/components/loading-component"
import { CreatePostSuccessModal } from "@app/components/create-post-success-modal"
const { width, height } = Dimensions.get("window")
const IMAGE_WIDTH = width - 30 * 2
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.61
interface Props {
  navigation: StackNavigationProp<MarketPlaceParamList>
}
const DetailComponent = () => {
  const tempStore = useSelector((state: RootState) => state.storeReducer?.tempStore)
  return (
    <View style={{ width: "100%" }}>
      <Row>
        <View style={detailStyle.rowItem}>
          <Text style={detailStyle.label}>{eng.price}</Text>
          <Text style={detailStyle.value}>$ {tempStore?.price || 0}</Text>
        </View>
        {/* <View style={detailStyle.rowItem}>
          <Text style={detailStyle.label}>{eng.cuisines}</Text>
          <Text style={detailStyle.value}>Western, Asian</Text>
        </View> */}
      </Row>
      <Text style={detailStyle.label}>{eng.description}</Text>
      <Text style={detailStyle.value}>{tempStore?.description}</Text>
    </View>
  )
}
const detailStyle = StyleSheet.create({
  value: {
    color: "#9499A5",
    fontFamily: typography.regular,
    fontSize: fontSize.font15,
    marginTop: 5,
  },
  label: { color: "#212121", fontFamily: typography.medium, fontSize: fontSize.font16 },
  rowItem: { flex: 1, marginVertical: 10 },
})
export const StoreDetailScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<RouteProp<RootStackParamList, "StoreDetail">>()
  const editable = route.params.editable
  const [store, setStore] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  const tempStore = useSelector((state: RootState) => state.storeReducer?.tempStore)
  const thumbnail = useSelector(
    (state: RootState) => state.storeReducer?.tempStore?.mainImageUrl,
  )
  const formatRequestObject = (tempPost) => {
    return {
      ...tempPost,
      latitude: tempPost.location.lat,
      longitude: tempPost.location.long,
      categoryId: tempPost.category,
      price: parseFloat(tempPost.price || 0),
      userId: "hardcoded_user_id",
      address: "hardcoded_address",
    }
  }
  const onSubmit = async () => {
    try {
      setIsLoading(true)
      let request = formatRequestObject(tempStore)
      console.log("store: ", tempStore, request)
      let res = await createPost(request)

      setIsVisible(true)
    } catch (error) {
      Alert.alert(`Something goes wrong \n ${JSON.stringify(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  React.useEffect(() => {
    if (route.params.storeInfor) {
      setStore(route.params.storeInfor)
    } else {
      setStore(tempStore)
    }
  }, [])
  return (
    <Screen style={styles.container}>
      <ImageBackground
        source={thumbnail ? { uri: thumbnail } : images.landscapePlaceholderImage}
        style={styles.imageBackground}
      >
        <HeaderComponent
          style={{ paddingHorizontal: 20, marginTop: 10 }}
          rightComponent={
            editable ? (
              <Row containerStyle={styles.headerRow}>
                <Text style={styles.headerText}>{eng.update_cover_image}</Text>
                <Image
                  source={images.uploadIcon}
                  style={{ width: 25, height: 19, marginLeft: 5 }}
                />
              </Row>
            ) : null
          }
        />
        {editable ? (
          <TouchableOpacity
            style={styles.editButtonContainer}
            onPress={() => {
              navigation.navigate("CreatePost")
            }}
          >
            <EditSvg />
          </TouchableOpacity>
        ) : null}
      </ImageBackground>
      <View style={styles.contentContainer}>
        <Row containerStyle={styles.titleRow}>
          <Text style={[styles.title]}>{store.name}</Text>
          <Row containerStyle={styles.locationButtonContainer}>
            <Text style={styles.locationText}>{eng.location}</Text>
            <View style={styles.locationSvgContainer}>
              <LocationSvg />
            </View>
          </Row>
        </Row>
        <Row containerStyle={[{ marginTop: 5, alignItems: "center" }]}>
          <LocationMarkerSvg />
          <Text style={styles.addressText}>{getLocation(store.location)}</Text>
        </Row>
        <StarRating
          disabled
          maxStars={5}
          rating={store.rating}
          selectedStar={(rating) => {}}
          emptyStarColor={"#FFC62B"}
          fullStarColor={"#FFC62B"}
          starSize={18}
          containerStyle={{ width: 18 * 5 + 4 * 7, marginVertical: 10 }}
        />
        <Text style={styles.value}>{store.description}</Text>
        <DetailComponent />

        {editable ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#3653FE",
              alignSelf: "flex-end",
              paddingHorizontal: 15,
              paddingVertical: 5,
              marginVertical: 15,
              borderRadius: 22,
            }}
            onPress={onSubmit}
          >
            <Text style={styles.locationText}>{eng.submit}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <LoadingComponent isLoading={isLoading} />
      <CreatePostSuccessModal
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false)
          navigation.navigate("MarketPlace")
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  contentContainer: { flex: 1, paddingHorizontal: 30, width: "100%" },
  locationSvgContainer: {
    borderRadius: 100,
    padding: 6,
    backgroundColor: "white",
    marginLeft: 7,
  },
  imageBackground: { width, height: height * 0.3, borderRadius: 8, marginTop: 10 },
  value: {
    color: "#9499A5",
    fontFamily: typography.regular,
    fontSize: fontSize.font13,
    marginTop: 5,
  },
  headerRow: {
    backgroundColor: "#3653FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontFamily: typography.regular,
    fontSize: fontSize.font14,
  },
  addressText: {
    color: "#211414",
    fontFamily: typography.regular,
    fontSize: fontSize.font12,
    marginLeft: 5,
  },
  locationText: {
    color: "white",
    fontFamily: typography.medium,
    fontSize: fontSize.font14,
  },
  locationButtonContainer: {
    backgroundColor: "#3653FE",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  titleRow: { alignItems: "center", justifyContent: "space-between", marginTop: 30 },
  editButtonContainer: {
    position: "absolute",
    width: 58,
    height: 58,
    bottom: -24,
    right: 20,
    backgroundColor: "#EAEDFF",
    borderRadius: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontFamily: typography.regular, fontWeight: "400", fontSize: fontSize.font20 },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
})