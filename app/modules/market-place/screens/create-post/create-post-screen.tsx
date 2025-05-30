import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line react-native/split-platform-components
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { color, palette } from "@app/modules/market-place/theme"
import { HeaderComponent } from "../../components/header"
import { images } from "@app/modules/market-place/assets/images"
import { useDispatch, useSelector } from "react-redux"
import { setTempPost } from "@app/modules/market-place/redux/reducers/store-reducer"
import { MarketPlaceParamList } from "@app/modules/market-place/navigation/param-list"
import { StackNavigationProp } from "@react-navigation/stack"
import { LoadingComponent } from "@app/modules/market-place/components/loading-component"
import { autoCompleteTags, getTags } from "@app/modules/market-place/graphql"
import { RootState } from "@app/modules/market-place/redux"
import { Screen } from "@app/components/screen"
import { MarketPlaceCommonStyle } from "../../theme/style"
import { fontSize, typography } from "../../theme/typography"
import { TagComponent } from "../../components/tag-components"
import { MarketplaceTag, TemplateMarketPlaceTag } from "../../models"
import TextInputComponent from "../../components/text-input-component"
import { useI18nContext } from "@app/i18n/i18n-react"
import { marketPlaceColor } from "../../theme/color"
const { width, height } = Dimensions.get("window")
interface Props {
  navigation: StackNavigationProp<MarketPlaceParamList>
}
export const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tagLoading, setTagLoading] = useState(false)
  const tempPost = useSelector((state: RootState) => state.storeReducer.tempPost)
  const [tag, setTag] = useState("")

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const [filteredTags, setFilteredTags] = useState<MarketplaceTag[]>([])
  const [selectedTags, setSelectedTags] = useState<MarketplaceTag[]>([])
  const [initTag, setInitTag] = useState<MarketplaceTag[]>([])
  const timeoutRef = useRef(null)
  const { LL: t } = useI18nContext()

  const isCorrectInput = () => {
    let nameValid = false
    let emailValid = false
    let descriptionValid = false

    if (!name) setNameError(t.marketPlace.name_is_required())
    // check if name is full of spaces or less than 2 characters
    else if (name?.trim().length < 2) {
      setNameError(t.marketPlace.name_length_validation())
    } else {
      nameValid = true
      setNameError("")
    }

    if (!email) {
      setEmailError(t.marketPlace.email_is_required())
    } else if (
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(email) === false
    ) {
      setEmailError(t.marketPlace.email_is_invalid())
    } else {
      emailValid = true
      setEmailError("")
    }

    if (!description) {
      setDescriptionError(t.marketPlace.description_is_required())
    } // check if description is full of spaces or less than 2 characters
    else if (description?.trim().length < 2) {
      setDescriptionError(t.marketPlace.description_must_be_more_than_2_characters())
    } else {
      descriptionValid = true
      setDescriptionError("")
    }

    return Boolean(nameValid && descriptionValid && emailValid)
  }
  const onNext = () => {
    if (!isCorrectInput()) return

    dispatch(
      setTempPost({
        ...tempPost,
        name,
        email,
        description,
        tags: selectedTags,
      }),
    )

    navigation.navigate("AddImage")
  }
  const addTag = (item: MarketplaceTag) => {
    const newTags = [...selectedTags]

    if (selectedTags.findIndex((tag) => tag.name === item.name) !== -1) {
      setSelectedTags(newTags)
      return
    }
    if (newTags.length >= 5) newTags.pop()

    newTags.unshift(item)

    setSelectedTags(newTags)
    setTag("")
  }
  const removeSelectedTag = (index: number) => {
    // remove tag at index
    const newTags = [...selectedTags]
    newTags.splice(index, 1)
    setSelectedTags(newTags)
  }

  const debounceFindTags = (text: string) => {
    timeoutRef.current = setTimeout(() => {
      setTagLoading(true)
      autoCompleteTags(text)
        .then((data) => {
          setFilteredTags(data)
        })
        .finally(() => {
          setTagLoading(false)
        })
    }, 500)
  }
  const onChangeTags = (text: string) => {
    setTag(text)
    if (!text) return clearTimeout(timeoutRef.current || 0)

    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      debounceFindTags(text)
    } else {
      debounceFindTags(text)
    }
  }
  const renderEmptyTagList = () => {
    if (tagLoading) return <ActivityIndicator color={color.primary} />
    return tag ? <Text>{t.marketPlace.cant_find_tag_Add_your_own()}</Text> : null
  }

  const renderTagItem = ({ item }: { item: MarketplaceTag }) => {
    const onTagPress = () => addTag(item)

    return <TagComponent title={item.name} onPress={onTagPress} />
  }

  const renderAddTagText = () => {
    const isTagNotFound = tag && !tagLoading && !filteredTags?.length
    return isTagNotFound ? (
      <Text
        style={[styles.text, { color: color.primary }]}
        onPress={() => {
          addTag({ ...TemplateMarketPlaceTag, name: tag })
          setTag("")
        }}
      >
        {t.marketPlace.add()}
      </Text>
    ) : null
  }

  const filterTags = useMemo(() => {
    const displayTags = !filteredTags?.length && !tag ? initTag : filteredTags
    return displayTags.filter((tag) => {
      const index = selectedTags.findIndex((selectedTag) => tag.name === selectedTag.name)
      return index === -1
    })
  }, [selectedTags, filteredTags])

  const renderSelectedTag = ({
    item,
    index,
  }: {
    item: MarketplaceTag
    index: number
  }) => {
    const onClearTag = () => removeSelectedTag(index)
    return <TagComponent title={item.name} onClear={onClearTag} />
  }

  useEffect(() => {
    const initData = () => {
      setIsLoading(true)
      getTags()
        .then((tags) => {
          setFilteredTags(tags)
          setInitTag(tags)
        })
        .finally(() => setIsLoading(false))
    }
    initData()
  }, [])
  return (
    <Screen
      style={styles.container}
      keyboardOffset={"none"}
      //  preset="scroll"
    >
      <HeaderComponent style={{ paddingHorizontal: 20, width }} />
      <View style={{ flex: 1 }}>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              Keyboard.dismiss()
            }}
            activeOpacity={1}
          >
            <View style={MarketPlaceCommonStyle.center}>
              <Image
                source={images.backgroundSimple}
                style={{ width: 177, height: 158 }}
              />
              <Text style={styles.title}>{t.marketPlace.create_post()}</Text>
            </View>
            <View style={{ paddingHorizontal: 30, width: "100%" }}>
              <Text style={styles.labelStyle}>{t.marketPlace.name()}</Text>
              <TextInputComponent
                onChangeText={setName}
                value={name}
                placeholder={t.marketPlace.name()}
                isError={nameError !== ""}
              />

              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

              <Text style={styles.labelStyle}>{t.marketPlace.email()}</Text>
              <TextInputComponent
                onChangeText={setEmail}
                value={email}
                placeholder={t.marketPlace.email()}
                isError={emailError !== ""}
              />

              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <Text style={styles.labelStyle}>{t.marketPlace.your_selected_tag()}</Text>
              <FlatList
                data={selectedTags}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderSelectedTag}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                keyExtractor={(item, index) => item._id + "_" + index}
              />
              {selectedTags?.length >= 5 ? (
                <Text style={styles.errorText}>
                  {t.marketPlace.you_can_select_up_to_5_tags()}
                </Text>
              ) : null}
              <TextInputComponent
                containerStyle={{ marginTop: selectedTags?.length ? 12 : 0 }}
                onChangeText={(text) => onChangeTags(text)}
                value={tag}
                placeholder={t.marketPlace.enter_your_own_tags()}
                isError={false}
                rightComponent={renderAddTagText}
              />
              <FlatList
                data={filterTags}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={renderEmptyTagList}
                renderItem={renderTagItem}
                style={{ marginTop: 12 }}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                keyExtractor={(item) => item._id}
              />
              <Text style={styles.labelStyle}>{t.marketPlace.description()}</Text>
              <TextInputComponent
                placeholder={t.marketPlace.description()}
                textField={true}
                onChangeText={setDescription}
                value={description}
                isError={descriptionError !== ""}
              />
              {descriptionError ? (
                <Text style={styles.errorText}>{descriptionError}</Text>
              ) : null}
              <View style={{ alignItems: "flex-end", marginVertical: 15 }}>
                <TouchableOpacity style={styles.button} onPress={onNext}>
                  <Text style={styles.text}>{t.marketPlace.next()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <LoadingComponent isLoading={isLoading} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: fontSize.font12,
    color: marketPlaceColor.darkPink,
    marginTop: 5,
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: fontSize.font16,
    borderRadius: 4,
  },
  labelStyle: {
    fontSize: fontSize.font16,
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: fontSize.font16,
    color: "white",
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 7,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "400",
    fontSize: fontSize.font20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: palette.lighterGrey,
    alignItems: "center",
  },
})
