import { BankAccountCr } from "@app/graphql/generated"
import { testProps } from "@app/utils/testProps"
import { SearchBar } from "@rneui/base"
import { Colors, Text } from "@rneui/themed"
import { View, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { UseSnipDetailsStyles } from "../styles/sinpe-details"
import { TranslationFunctions } from "@app/i18n/i18n-types"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SnipeDetailsState } from "../hooks/useSinpeDetails"

interface Props {
  bankAccount: Array<BankAccountCr>
  styles: UseSnipDetailsStyles
  LL: TranslationFunctions
  state: SnipeDetailsState
  onBankAccountSelected: (account: BankAccountCr) => void
  toggleBankModal: () => void
  colors: Colors
  reset: () => void
}

const BankAccounts = ({
  bankAccount,
  styles,
  LL,
  state,
  onBankAccountSelected,
  toggleBankModal,
  colors,
  reset,
}: Props) => (
  <View style={styles.container}>
    <Icon
      name="close"
      style={styles.closeIcon}
      onPress={toggleBankModal}
      color={colors.black}
    />

    {bankAccount?.length > 0 && (
      <SearchBar
        {...testProps(LL.common.search())}
        placeholder={LL.common.search()}
        value={state.searchText}
        platform="default"
        round
        autoFocus
        showLoading={false}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarText}
        rightIconContainerStyle={styles.searchBarRightIconStyle}
        searchIcon={<Icon name="search" size={24} color={styles.icon.color} />}
        clearIcon={
          <Icon name="close" size={24} onPress={reset} color={styles.icon.color} />
        }
      />
    )}
    <ScrollView>
      {state.matchingAccounts?.map((account, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onBankAccountSelected(account)}
          style={styles.cardContainer}
          // {...testProps(title)}
        >
          <View style={styles.spacing}>
            <Text type="p2">{account?.data?.accountAlias}</Text>
            <Text>{account?.data?.iban}</Text>

            <Text type={"p4"} ellipsizeMode="tail" numberOfLines={1}>
              {account?.data?.currency}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)

export default BankAccounts
