import * as React from "react"
import { useEffect, useState } from "react"
// eslint-disable-next-line react-native/split-platform-components
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { color } from "@app/modules/market-place/theme"
import { images } from "@app/modules/market-place/assets/images"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@app/modules/market-place/redux"
import { MarketPlaceParamList } from "@app/modules/market-place/navigation/param-list"
import { StackNavigationProp } from "@react-navigation/stack"
import EditSvg from "@app/modules/market-place/assets/svgs/edit-pen.svg"
import LocationSvg from "@app/modules/market-place/assets/svgs/location.svg"
import EyeOffSvg from "@app/modules/market-place/assets/svgs/eye-off.svg"
import EyeOnSvg from "@app/modules/market-place/assets/svgs/eye-on.svg"
import LocationMarkerSvg from "@app/modules/market-place/assets/svgs/location-marker.svg"
import { RouteProp, useRoute } from "@react-navigation/native"

import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { clearTempStore } from "@app/modules/market-place/redux/reducers/store-reducer"
import { RootStackParamList } from "@app/navigation/stack-param-lists"
import { Screen } from "@app/components/screen"
import { TagComponent } from "../../components/tag-components"
import { useI18nContext } from "@app/i18n/i18n-react"
import { Row } from "../../components/row"
import { fontSize } from "../../theme/typography"
import { getLocation, openMap } from "../../utils/helper"
import { CreatePostSuccessModal } from "../../components/create-post-success-modal"
import { createPost, createTag, getPostDetail } from "../../graphql"
import { MarketplaceTag } from "../../models"
import { ReportPostModal } from "../../components/report-post-modal"
import { styles } from "./styles"
import { PostDetailHeader } from "./components/PostDetailHeader"

type Props = {
  navigation: StackNavigationProp<MarketPlaceParamList>
}

type DetailComponentProps = {
  editable: boolean
  isHidePhone: boolean
  setIsHidePhone: (value: boolean) => void
  post: any
}
const DetailComponent = ({
  editable,
  isHidePhone,
  setIsHidePhone,
  post,
}: DetailComponentProps) => {
  const { LL: t } = useI18nContext()

  const renderTags = () => {
    return post?.tags?.map((tag: MarketplaceTag) => {
      return <TagComponent title={tag.name} key={tag.name} style={{ marginRight: 10 }} />
    })
  }
  return (
    <View style={{ width: "100%" }}>
      <View style={detailStyle.rowItem}>
        <Text style={detailStyle.label}>{t.marketPlace.tags()}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {renderTags()}
        </ScrollView>
      </View>
      <Text style={detailStyle.label}>{t.marketPlace.description()}</Text>
      <Text style={detailStyle.value}>{post?.description}</Text>

      <Text style={detailStyle.label}>{t.marketPlace.email()}</Text>
      <Text style={detailStyle.value}>{post?.email}</Text>

      <View style={detailStyle.rowItem}>
        <Row hc>
          <Text style={[detailStyle.label, { marginRight: 5 }]}>
            {t.marketPlace.phone_number()}
          </Text>
          {editable && (
            <TouchableOpacity
              onPress={() => setIsHidePhone(!isHidePhone)}
              style={detailStyle.label}
            >
              {isHidePhone ? <EyeOnSvg /> : <EyeOffSvg />}
            </TouchableOpacity>
          )}
        </Row>
        <Text style={detailStyle.value}>
          {isHidePhone ? "---------" : post?.phone || post?.owner?.phoneNumber}
        </Text>
      </View>
    </View>
  )
}

const detailStyle = StyleSheet.create({
  value: {
    color: "#9499A5",
    fontSize: fontSize.font15,
    marginTop: 5,
  },
  label: { color: "#212121", fontSize: fontSize.font16, marginTop: 10 },
  rowItem: { marginVertical: 10 },
})
export const PostDetailScreen = ({ navigation }: Props) => {
  const route = useRoute<RouteProp<RootStackParamList, "PostDetail">>()

  const [isHidePhone, setIsHidePhone] = useState(false)
  const editable = route.params?.editable
  const isMyPost = route.params?.isMyPost
  const [post, setPost] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isReportVisible, setIsReportVisible] = useState(false)

  const dispatch = useDispatch()

  const tempPost = useSelector((state: RootState) => state.storeReducer?.tempPost)
  const thumbnail = useSelector(
    (state: RootState) => state.storeReducer?.tempPost?.mainImageUrl,
  )

  const { LL: t } = useI18nContext()
  const formatRequestObject = (tempPost: any) => {
    return {
      ...tempPost,
      hidePhoneNumber: isHidePhone,
      tagsIds: tempPost.tags?.map((item: MarketplaceTag) => item._id),
      latitude: post.location.lat,
      longitude: post.location.long,
      categoryId: post.category,
      price: parseFloat(post.price || 0),
      userId: "hardcoded_user_id",
      address: post.address || getLocation(post.location),
      phoneNumber: tempPost.phone,
    }
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      let modifiedTempPost = { ...tempPost }
      const skipCreateTag = tempPost.tags?.every((tag) => tag._id)

      if (!skipCreateTag) {
        const requests = modifiedTempPost.tags
          .filter((tag) => !tag._id)
          .map((tag) => createTag(tag.name))
        const res = await Promise.all(requests)
        const newTags = [...res, ...tempPost.tags].filter((tag) => tag._id)
        modifiedTempPost = { ...tempPost, tags: newTags }
      }

      const request = formatRequestObject(modifiedTempPost)
      await createPost(request)

      setIsVisible(true)
    } catch (error) {
      Alert.alert(`Something goes wrong`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    const onOpenMap = () => {
      if (post?.location?.lat && post?.location?.long) {
        openMap(post?.location?.lat, post?.location?.long)
      } else if (post?.location?.coordinates.length) {
        openMap(post?.location?.coordinates[1], post?.location?.coordinates[0])
      }
    }
    if (!post) return <ActivityIndicator />
    return (
      <View style={styles.contentContainer}>
        {editable ? (
          <TouchableOpacity
            style={styles.editButtonContainer}
            onPress={() => navigation.navigate("CreatePost")}
          >
            <EditSvg fill={color.primary} />
          </TouchableOpacity>
        ) : null}

        <Row containerStyle={styles.titleRow}>
          <Text style={[styles.title, { flex: 1, paddingRight: 10 }]}>{post.name}</Text>
          {!editable && (
            <TouchableOpacity onPress={onOpenMap}>
              <Row containerStyle={styles.locationButtonContainer}>
                <Text style={styles.locationText}>{t.marketPlace.location()}</Text>
                <View style={styles.locationSvgContainer}>
                  <LocationSvg fill={color.primary} />
                </View>
              </Row>
            </TouchableOpacity>
          )}
        </Row>

        <Row containerStyle={[{ marginTop: 5, alignItems: "center" }]}>
          <LocationMarkerSvg fill={color.primary} />
          <Text style={styles.addressText}>
            {post?.address || getLocation(post.location)}
          </Text>
        </Row>

        <DetailComponent
          editable={editable}
          setIsHidePhone={setIsHidePhone}
          isHidePhone={isHidePhone}
          post={post}
        />

        {editable ? (
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.locationText}>{t.marketPlace.submit()}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

  const getUri = () => {
    if (post) {
      return post.mainImageUrl ? post.mainImageUrl : images.landscapePlaceholderImage
    }
    return thumbnail ? thumbnail : images.landscapePlaceholderImage
  }

  useEffect(() => {
    if (route.params?.postId) {
      setIsLoading(true)

      getPostDetail(route.params?.postId)
        .then((res) => {
          setPost(res)
        })
        .finally(() => setIsLoading(false))
    } else if (route.params.postInfo) {
      const { owner } = route.params.postInfo
      const { hidePhoneNumber, phoneNumber } = owner || {}

      setPost(route.params.postInfo)
      setIsHidePhone(hidePhoneNumber)
    } else {
      setPost(tempPost)
    }
  }, [])

  return (
    <Screen style={styles.container}>
      <PostDetailHeader
        post={post}
        thumbnail={getUri()}
        editable={editable}
        setIsReportVisible={setIsReportVisible}
        isMyPost={isMyPost}
      />
      {renderContent()}
      <LoadingComponent isLoading={isLoading} />
      <CreatePostSuccessModal
        isVisible={isVisible}
        onClose={() => {
          dispatch(clearTempStore())
          setIsVisible(false)
          navigation.navigate("StoreList")
        }}
      />
      <ReportPostModal
        isVisible={isReportVisible}
        post={post}
        onClose={() => {
          setIsReportVisible(false)
        }}
      />
    </Screen>
  )
}
